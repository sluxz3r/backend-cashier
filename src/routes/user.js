const express = require('express')
const Route = express.Router()

const UserController = require('../controller/user')
const Auth = require('../helpers/auth')

Route
  .get('/product/', UserController.GetAll)
  .post('/product/', UserController.AddProduct)
  .post('/register/', UserController.Register)
  .post('/login/', UserController.Login)
  .patch('/logout/:userid', UserController.Logout)

module.exports = Route