const express = require('express')
const router = express.Router()

router.all('/test', (req, res, next) => {
  res.status(200).json({ test: 'te' })
})
module.exports = router
