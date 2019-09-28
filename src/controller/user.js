const userModels = require('../models/user')
const CashierHelper = require('../helpers/helpers')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary')
const sgMail = require('@sendgrid/mail');

module.exports = {
  GetAll: (req, res) => {
    const product = req.query.product || ''
    const order = req.query.order || 'Asc'
    userModels.GetAll(product, order)
      .then((resultRegister) => {
        CashierHelper.response(res, resultRegister, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  getTrans: (req, res) => {
    userModels.getTrans()
      .then((resultRegister) => {
        CashierHelper.response(res, resultRegister, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  getIdProd:(req, res) => {
    userModels.getIdProd()
      .then((resultRegister) => {
        CashierHelper.response(res, resultRegister, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  AddProduct: async (req, res) => {
    let path = req.file.path;
    let geturl = async (req) => {
      cloudinary.config({
        cloud_name: 'dbhwvh1mf',
        api_key: '718924645383124',
        api_secret: 'yhTauEiKkLgr62XpgGTvsALrwUU'
      })

      let data
      await cloudinary.uploader.upload(path, (result) => {
        const fs = require('fs')
        fs.unlinkSync(path)
        data = result.url
      })

      return data
    }
    const data = {
      name: req.body.name,
      price: req.body.price,
      image: await geturl(),
      category: req.body.category,
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
      .then((result) => {
        CashierHelper.response(res, data, 200)
        console.log(result);
        
      })
      .catch((error) => {
        CashierHelper.res_error(res, 401, 'Email Sudah Terdaftar')   
        console.log(error);
      })
  },

  //Login
  Login: (req, res) => {
    const email = req.body.email
    const password = req.body.password

    userModels.getByEmail(email)
      .then((result) => {
        if(result.length > 0){
        const dataUser = result[0]
        const usePassword = CashierHelper.setPassword(password, dataUser.salt).passwordHash

        if (usePassword === dataUser.password) {
          dataUser.token = jwt.sign({
            userid: dataUser.userid
          }, process.env.SECRET_KEY || 'ARI', { expiresIn: '12h' })

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
          return CashierHelper.response(res,null, 401, 'Wrong Password!!!')
        }

      }else{
        return CashierHelper.response(res,null, 401, 'Email Tidak Terdaftar')
      }})
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

  Transaksi: (req, res) => {
    const data = {
      id_transaksi: req.body.id_transaksi,
      id_cashier: req.body.id_cashier,
      total: req.body.total,
      idProd: req.body.idProd,
      created_at: new Date(),
    }

    userModels.Transaksi(data)
      .then((resultRegister) => {
        CashierHelper.response(res, resultRegister, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  send: (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: req.body.email,
      from: 'mumu@hm.com',
      subject: 'Your Current Transaction',
      text: req.body.text,
      html: `<strong>${req.body.text}</strong>`,
    };
    sgMail.send(msg)
      .then((result) => {
        CashierHelper.response(res, result, 200)
      })
      .catch((err) => {
        console.log(err);
      });
  },

}
