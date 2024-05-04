var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dotenv = require("dotenv");
// 指定.env檔所在的位置，並將.env檔案中的環境變數載入到process.env中
dotenv.config({path:"./config.env"});

var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 貼文路由
const postRouter = require('./routes/posts');

// 資料庫設定開始
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
)

// 雲端資料庫
mongoose.connect(DB) // port號/後面接資料庫名稱，若不存在則會新增
    .then(res=> console.log("連線資料成功"));


var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

// 404
app.use((req, res, next) => {
    res.status(404).json({
        "status":"false",
        "message":"404 無此網站路由"
    })
});

module.exports = app;
