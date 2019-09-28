const conn = require('../config/db')
const jwt = require('jsonwebtoken')

module.exports = {
    //Get All Product
    GetAll: (product, order) => {
        const likeProduct = '%' + product + '%'
        return new Promise((resolve, reject) => {
            conn.query(`SELECT product.id_product, product.name, product.price, product.image, product.created_at, categori.cat_name FROM product INNER JOIN categori ON product.category=categori.id_cat WHERE product.name LIKE ? ORDER BY product.price ${order}`, likeProduct, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    getTrans:() => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM transaksi`, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    getIdProd:()=>{
        return new Promise((resolve, reject) => {
            conn.query(`SELECT idProd FROM transaksi`, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    //Add Product
    AddProduct : (data) => {
        return new Promise((resolve, reject) => {
            conn.query('INSERT INTO product SET ?', data, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    //Register
    Register: (data) => {
        return new Promise((resolve, reject) => {
            conn.query('INSERT INTO user SET ?', data, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    //Login
    getByEmail: (email) => {
        return new Promise((resolve, reject) => {
            conn.query('SELECT userid, email, fullname, created_at, salt, password FROM user WHERE email = ?', email, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
    updateToken: (email, token) => {
        return new Promise((resolve, reject) => {
            conn.query(`UPDATE user SET token = ? WHERE email =?`, [token, email], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    Logout: (userid) => {
        const test = 'test';
        return new Promise((resolve, reject) => {
            conn.query(`UPDATE user SET token = ? WHERE userid =?`, [test, userid], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    Transaksi: (data) => {
        return new Promise((resolve, reject) => {
            conn.query('INSERT INTO transaksi SET ?', data, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
}

