var express = require('express');
// 建立一個新的路由object來處理路由
var router = express.Router();
//模組化的Post model，習慣上model會用大寫
const Post = require("../models/postsModel");
//模組化的User model，習慣上model會用大寫
const User = require("../models/usersModel")


/*
Post.find()查詢所有document，
對每個查詢結果透過populate()填充關聯的user資訊。
當populate()方法被調用時，
Mongoose將尋找"user"欄位中的每個ObjectId，
然後在"User" model中搜尋對應的document。
select表示只回傳所需的欄位（"name"和"photo"）
*/

// 設置路由器以取得所有貼文
router.get('/', async function(req, res, next) {
  try{
    // 依照時間戳排序以及content欄位的關鍵字搜尋
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt";
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    // 等待資料庫回傳結果，因為這是一個異步操作，會返回promise，所以需要加await
    const posts = await Post.find(q).populate({
      // path指向要填充(populate)的欄位為"user"
      path: "user",
      // select表示關聯查詢後要顯示的欄位為"name"及"photo"
      select: "name photo"
    }).sort(timeSort);
    // asc 遞增(由小到大，由舊到新) createdAt ; 
    // desc 遞減(由大到小、由新到舊) "-createdAt";

    res.status(200).json({
      posts
  })
  }
  catch(error){
    res.status(500).json({
      "status":"false",
      "message":error
    })
  }
});


// 設置路由器以新增一筆貼文
router.post('/', async function(req, res, next) {
    try{
      const newPost = await Post.create(req.body);
      res.status(201).json({
        "message":"新增成功",
        posts: newPost
      })
    }
    catch(error){
      res.status(400).json({
        "status":"false",
        "message":error
      })
    }
  });


// 設置路由器以刪除所有貼文
router.delete('/', async function(req, res, next) {
  try{
      // 等待資料庫刪除完成，因為這是一個異步操作，會返回promise，所以需要加await
      await Post.deleteMany({});
      const posts = await Post.find();
      res.status(200).json({
          "status":"success",
          posts
      })
  }
  catch(error){
      res.status(500).json({
          "status":"false",
          "message":error
      })
  }
});


// 設置路由器以刪除一筆貼文
router.delete('/:id', async function(req, res, next) {
  try{
      const id = req.params.id;
      // 等待資料庫刪除完成，因為這是一個異步操作，會返回promise，所以需要加await
      const searchResult = await Post.findByIdAndDelete(id);
      if(!searchResult){
          res.status(404).json({
              "status":"false",
              "message":"無此 post ID"
          })
      }
      else{
          res.status(200).json({
              "status":"success",
              data:null
          })
      }
  }
  catch(error){
      res.status(400).json({
          "status":"false",
          "message":"post ID格式不正確"
      })
  }
});


// 設置路由器以更新一筆貼文
router.patch('/:id', async function(req, res, next) {
  try{
      const data = req.body;
      const id = req.params.id;
      // 等待資料庫更新資料，因為這是一個異步操作，會返回promise，所以需要加await
      // 在findByIdAndUpdate()加入第三個參數 {runValidators:true}讓它也執行Schema驗證
      const searchResult = await Post.findByIdAndUpdate(id, data, {runValidators:true});
      if(!searchResult){
          res.status(404).json({
              "status":"false",
              "message":"無此 post ID"
          })
      }
      else{
          // 等待資料庫回傳結果，因為這是一個異步操作，會返回promise，所以需要加await
          const updatedPost = await Post.findById(id);
          res.status(200).json({
              "status":"success",
              updatedPost
          })
      }
  }
  catch(error){
      res.status(400).json({
          "status":"false",
          "message":"post ID格式不正確或content為null"
      })
  }
  
});

module.exports = router;
