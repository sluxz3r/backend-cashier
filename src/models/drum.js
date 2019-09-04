const conn = require('../config/db')
const jwt = require('jsonwebtoken')

module.exports = {
    //Get Drum
    DrumSet: () => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM main`, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },
}

