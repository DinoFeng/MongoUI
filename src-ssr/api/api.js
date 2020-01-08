const express = require('express')
const router = express.Router()
const common = require('../util/common')

router.post('/assign', async (req, res) => {
  res.status(200).json(common.genObjectId())
})
// router.post('/test', async (req, res, next) => {
//   // const { body, params, url, query, headers } = req
//   // console.debug({ body, params, url, query, headers })
//   const { body } = req
//   const connectionPool = req.app.locals.connectionPool
//   const { assignId } = await connectionPool.assignConnection(body)
//   // console.debug('assignConnection outter', { assignId })
//   const result = _.merge({}, body, { assignId })
//   // console.debug(result)
//   res.status(200).json(result)
// })
// router.post('/test2', async (req, res, next) => {
//   const { body, params, url, query, headers } = req
//   console.debug({ body, params, url, query, headers })

//   const cp = req.app.locals.connectionPool
//   const { client } = await cp.assignConnection(body)
//   client.close()
//   res.status(200).json('OK')
// })
module.exports = router
