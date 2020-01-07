const express = require('express')
const router = express.Router()
// const consola = require('consola')
router.post('/test', (req, res) => {
  // consola.info('req.sessionID', req.sessionID)
  console.debug({ body: req.body, query: req.query })
  // Object.keys(req).forEach(k => console.debug({ [k]: req[k] }))
  res.status(200).json('OK')
  // const cp = req.app.locals.connectionPool
  // cp.assignConnection({
  //   connString: 'mongodb://localhost:27017/',
  // }).then(({ assignId, client, connection }) => res.status(200).json({ assignId }))
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
