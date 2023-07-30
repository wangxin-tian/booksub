# nodejs搭建服务

本项目是使用node构建的处理图书小程序的后台服务，用于处理小程序的请求以及数据库的处理

安装目录：

- express
- art-template
- express-art-template // 模板引擎
- body-parser 
- cookie-parser // 会话
- cookie-session
- nodemon // 自动重启服务
- mongoose

项目结构：

```js
+booksub
    |--app.js
    +bin/
    +config/
      |--config.js
      |--db.config.js
    +model/
      |--bookModel.js
      |--libraryModel.js
      |--subscription.js
      |--userModel.js
    |--package-lock.json
    |--package.json
    +public/
      +avatar_imgs/
        |--弟皇侠.jpg
      +cover_imgs/
        |--20230728131808.jpg
        |--20230728202827.jpg
        |--20230728202859.jpg
        |--20230729001603.jpg
        |--20230729164854.jpg
        |--20230729165151.jpg
        |--default.jpg
      +doc/
        |--Go语言编程.pdf
        |--uniapp.pdf
        |--只不过是孩子.pdf
        |--梦溪笔谈.pdf
        |--老子.pdf
      +imgs/
        |--01.jpg
    |--README.md
    +routes/
      |--index.js
    +utils/
      |--projectUrl.js
      |--tool.js
    +view/
    +workers/
      |--transform.py
```
