const express = require('express')
const Route = express.Router()

const UserController = require('../controller/user')
const Auth = require('../helpers/auth')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
let upload = multer({ storage: storage, limits: { fileSize: 100000000 } })

Route
  .get('/product/', UserController.GetAll)
  .get('/transaksi/', UserController.getTrans)
  .get('/transaksi/idprod/', UserController.getIdProd)
  .post('/product/', upload.single('image'), UserController.AddProduct)
  .post('/register/', UserController.Register)
  .post('/login/', UserController.Login)
  .post('/transaksi/', UserController.Transaksi)
  .post('/send/', UserController.send)
  .patch('/logout/:userid', UserController.Logout)
  

module.exports = Route