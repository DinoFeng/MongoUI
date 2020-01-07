const express = require('express')
const router = express.Router()

router.post('/test', (req, res, next) => {
  const { body, params, url, query, headers } = req
  console.debug({ body, params, url, query, headers })
  res.status(200).json({ body, params, url, query, headers })
})
// router.all('/test2', async (req, res, next) => {
//   // consola.info('req.sessionID', req.sessionID)
//   const data = req.body
//   const { assignId } = data
//   const cp = req.app.locals.connectionPool
//   const result = await cp.assignConnection({ assignId })
//   result.client.close()
//   res.status(200).json('OK')
// })
module.exports = router
