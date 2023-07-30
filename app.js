const express = require("express");
const config = require("./config/config");

require('./config/db.config');

const app = express();
config(app);
 
app.listen(3000, ()=>{
    console.log('Example app listening on port 3000!');
})