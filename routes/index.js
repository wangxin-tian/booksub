const fs = require('fs');
const express = require('express');
const multer = require('multer');
const {  spawn } = require('child_process');

const userModel = require('../model/userModel');
const bookModel = require('../model/bookModel');
const libraryModel = require('../model/libraryModel');
const subscription = require('../model/subscription');
const projectUrl = require('../utils/projectUrl');

const router = express.Router();
const upload = multer();

router.get('/', (req, res) => {
  //返回这个页面
  // res.render('news/index');
  res.send('hello')
});
/* user collection */
router.get('/user/info', (req, res) => {
  userModel.findOne({
    email: "email@qq.com"
  }).then(data => {
    res.send(data);
  })
})

/* book collection */
router.post('/book/add', (req, res) => {
  // console.log(req.body);
  const {
    title,
    author,
    publisher,
    cateName,
    imgUrl
  } = req.body;

  let bookDoc = new bookModel({
    title,
    author,
    publisher,
    cateName,
    imgUrl
  });
  bookDoc.save();

  res.send({
    ok: 1
  });
});

router.post('/book/addcomplete',
  /* 表单数据需要multer 来处理 */
  upload.any(), (req, res) => {
    const pdfBuffer = Buffer.from(req.files[0].buffer, 'base64'); // 通过fs写入下载pdf
    const {
      title,
      author,
      publisher,
      cateName,
      imgUrl,
      info
    } = req.body; // 存入book collection
    const workdir = projectUrl;
    const baseUrl = 'public/doc/';
    const fileUrl = `${baseUrl}${title}`;

    // 给表单内容添加到数据库
    bookModel.create({
      title,
      author,
      publisher,
      cateName,
      imgUrl,
      info
    }).then(_ => {});

    // 同步写入文件
    fs.writeFileSync(fileUrl, pdfBuffer);

    // 创建子线程执行python的pdf读取代码
    const pythonScriptPath = 'workers/transform.py';
    const args = [`${workdir}${baseUrl}${title}`, title, author];
    const pythonProcess = spawn('python', [`${workdir}${pythonScriptPath}`, ...args]);
    pythonProcess.on('close', (code) => { // 监听 Python 进程的退出
      console.log(`Python 进程退出，退出码：${code}`);
      res.send({'ok': 1});
    });
  })

router.get('/book/list', (req, res) => {
  bookModel.find({}, [
    'title',
    'author',
    'publisher',
    'cateName',
    'imgUrl'
  ]).then(data => {
    res.send(data);
  });

  /*userModel.find({}, ['username']).sort({age:-1}).skip().limit().then(data => {
    res.send(data);
  })
  根据年龄进行排序 当前为降序
  skip(0) limit(10) 同[0:10]
  */
});

router.get('/book/group_by_catename', (req, res) => {
  bookModel.aggregate([{
      $group: {
        _id: "$cateName",
        books: {
          $push: "$$ROOT"
        }
      }
    },
    {
      $project: {
        _id: 0,
        catename: "$_id",
        books: {
          $slice: ["$books", 4]
        }
      }
    }
  ]).then((data) => {
    let result = [];
    for (let item of data) {
      result.push(item.books);
    }
    res.send(result);
  })
});

router.post('/book/match', (req, res) => {
  // console.log(req.body);
  const searchTerm = req.body.msg; // 使用正则表达式进行模糊查询
  const regex = new RegExp(searchTerm, 'i'); // 'i' 表示不区分大小写

  bookModel.find({
    $or: [{
      title: regex
    }, {
      author: regex
    }, {
      cateName: regex
    }]
  }, [
    'title',
    'author',
    'publisher',
    'cateName',
    'imgUrl'
  ]).limit(10).then(data => {
    res.send(data);
  });
});

/* subscription collection */
router.post('/subscription/verify', (req, res) => {
  const user_id = req.body.user_id;
  const book_id = req.body.book_id;

  subscription.findOne({
    user_id,
    book_id
  }).then(data => {
    res.send(data);
  })
})

router.post('/subscription/subscript', (req, res) => {
  const add = req.body.add; /* boolean */
  const user_id = req.body.user_id;
  const book_id = req.body.book_id;

  // console.log(req.body)
  // console.log({
  //   user_id,
  //   book_id
  // });
  if (add) {
    subscription.create({
      user_id: user_id,
      book_id: book_id
    }).then(data => {
      // console.log(data);
      res.send({
        ok: 1
      });
    });
  } else {
    subscription.deleteOne({
      user_id: user_id,
      book_id: book_id
    }).then(data => {
      // console.log(data);
      res.send({
        ok: 1
      });
    });
  }

})

/* libraryModel collection */
router.post('/library/page', (req, res) => {
  const body = req.body;
  const title = body.title;
  const chapterNumber = body.pages;

  // console.log(body);

  libraryModel.findOne({
    title,
    chapters: {
      $elemMatch: {
        chapterNumber
      }
    }
  }, {
    "chapters.$": 1
  }).then(data => {
    res.send(data);
  })
})

module.exports = router;