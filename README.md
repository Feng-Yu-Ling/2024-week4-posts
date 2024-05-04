# ✨六角學院 2024 Node.js 直播班✨
## 第四週：期中考：打造全端 (Full Stack) 網站架構
### 設計一個/posts路由
* 將第三週程式碼整合 user model，只做後端API
* 透過populate語法進行關聯查詢
* 透過express語法建立專案
* routes：將網址路徑管理拆到routes資料夾的posts.js
* model：將post collections拆到model資料夾，並載入到routes/posts.js上
* model：新增user collections並載入到routes/users.js上
* 連接至MongoDB雲端資料庫
* 藉由環境變數隱藏敏感資訊
* 部屬至Render託管
* 提供POSTMAN
### 更新內容
* 提供config.env.example讓其他開發者知道需要載入哪些環境變數
* 移除mongoose所添加的__v (version key)
* 針對成功的操作，express預設給予200狀態碼，不須手動設定
* findByIdAndUpdate的參數加上new:true可回傳更新後的資料
* 對刪除全部貼文的路由進行保護處理，避免刪除單筆貼文的錯誤操作
* 對schema的必要欄位添加trim:true避免輸入多個空格逃過驗證
* 在app.js加上404的相關程式以捕捉輸入錯誤路由(無此網站路由)
