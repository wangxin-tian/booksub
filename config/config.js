const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const indexRouters = require('../routes/index');
 
var appConfig = app => {
    // 静态资源找寻的文件夹
    app.use(express.static("public")); 
 
    // 模板引擎
    app.engine('html', require('express-art-template'));
    app.set('view options', {
        debug: process.env.NODE_ENV !== 'development'
    });
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'html');
 
    // 设置获取请求体
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json()); 
 
    // cookie的注册
    app.use(cookieParser());  
    // session的注册
    app.use(cookieSession({
        name:"my_session",
        keys:["%$#^&^%&TSFR#$TRGDRG$%GFDG%^$#%#^GFDGRDHG$#@^Y%"],
        maxAge:1000*60*60*24*2    //过期时间设置为2天
    }));

    app.use(indexRouters); // 使用路由
}
 
module.exports = appConfig;