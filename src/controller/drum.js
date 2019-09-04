const drumModels = require('../models/drum')
const DrumHelper = require('../helpers/helpers')
const jwt = require('jsonwebtoken')

module.exports = {
  //Get Drum URL
  DrumSet: (req, res) => {
    drumModels.DrumSet()
      .then((drumResult) => {
        const result = drumResult
        DrumHelper.response(res, result, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}