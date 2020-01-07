const express = require('express')
const router = express.Router()

router.post('/test', (req, res, next) => {
  const { body, params, url, query, headers } = req
  console.debug({ body, params, url, query, headers })
  res.status(200).json({ body, params, url, query, headers })
})
module.exports = router
