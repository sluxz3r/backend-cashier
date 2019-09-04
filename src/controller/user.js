const userModels = require('../models/user')
const CashierHelper = require('../helpers/helpers')
const jwt = require('jsonwebtoken')

module.exports = {
  GetAll:(req, res) => {
    userModels.GetAll()
      .then((resultRegister) => {
        CashierHelper.response(res, resultRegister, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },



  AddProduct: (req, res) => {
    const data = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      created_at: new Date(),
    }

    userModels.AddProduct(data)
      .then((resultRegister) => {
        CashierHelper.response(res, resultRegister, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  //Register
  Register: (req, res) => {
    const salt = CashierHelper.generateSalt(18)
    const passwordHash = CashierHelper.setPassword(req.body.password, salt)

    const data = {
      email: req.body.email,
      fullname: req.body.fullname,
      password: passwordHash.passwordHash,
      salt: passwordHash.salt,
      token: 'Test',
      created_at: new Date(),
    }

    userModels.Register(data)
      .then((resultRegister) => {
        CashierHelper.response(res, resultRegister, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  //Login
  Login: (req, res) => {
    const email = req.body.email
    const password = req.body.password

    userModels.getByEmail(email)
      .then((result) => {
        const dataUser = result[0]
        const usePassword = CashierHelper.setPassword(password, dataUser.salt).passwordHash

        if (usePassword === dataUser.password) {
          dataUser.token = jwt.sign({
            userid: dataUser.userid
          }, process.env.SECRET_KEY||'ARI', { expiresIn: '12h' })

          delete dataUser.salt
          delete dataUser.password
          userModels.updateToken(email, dataUser.token)
            .then((result) => {

            })
            .catch((err) => {
              console.log(err)
            })

          return CashierHelper.response(res, dataUser, 200)
        } else {
          return CashierHelper.response(res, null, 403, 'Wrong password!')
        }

      })
      .catch((error) => {
        console.log(error)
      })

  },

  //Logout
  Logout: (req, res) => {
    const userid = req.params.userid;

    userModels.Logout(userid)
      .then((resultUser) => {
        const result = resultUser[0]
        CashierHelper.response(res, result, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}