// require('../util/cycle')

// const express = require('express')
// const router = express.Router()
// const common = require('../util/common')

// // const getCircularReplacer = () => {
// //   const seen = new WeakSet()
// //   return (key, value) => {
// //     if (typeof value === 'object' && value !== null) {
// //       if (seen.has(value)) {
// //         return
// //       }
// //       seen.add(value)
// //     }
// //     return value
// //   }
// // }
// class Test {
//   constructor(v) {
//     this.pre = null
//     this.next = null
//     this.id = v
//   }
// }
// router.all('/test', async (req, res) => {
//   const t1 = new Test(1)
//   const t2 = new Test(2)
//   const t3 = new Test(3)
//   t1.pre = t3
//   t1.next = t2
//   t2.pre = t1
//   t2.next = t3
//   t3.pre = t2
//   t3.next = t1

//   res.status(200).send(JSON.stringify(JSON.decycle(t1)))
// })

// // router.post('/test', async (req, res, next) => {
// //   // const { body, params, url, query, headers } = req
// //   // console.debug({ body, params, url, query, headers })
// //   const { body } = req
// //   const connectionPool = req.app.locals.connectionPool
// //   const { assignId } = await connectionPool.assignConnection(body)
// //   // console.debug('assignConnection outter', { assignId })
// //   const result = _.merge({}, body, { assignId })
// //   // console.debug(result)
// //   res.status(200).json(result)
// // })
// // router.post('/test2', async (req, res, next) => {
// //   const { body, params, url, query, headers } = req
// //   console.debug({ body, params, url, query, headers })

// //   const cp = req.app.locals.connectionPool
// //   const { client } = await cp.assignConnection(body)
// //   client.close()
// //   res.status(200).json('OK')
// // })
// module.exports = router
