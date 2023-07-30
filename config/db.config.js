const db = require('mongoose');

const baseURL = 'mongodb://127.0.0.1:27017/'; // 这里不能使用localhost，需要明确使用ipv4地址
const collectionName = 'tsdy';

db.connect(baseURL+collectionName).then(() => {
    console.log('MongoDB数据库连接成功')
});