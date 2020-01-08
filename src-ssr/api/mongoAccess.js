const express = require('express')
const router = express.Router()
const common = require('../util/common')

router.post('/:server/:db/:table/:page/find', async (req, res) => {
  const { body, params, url, query, headers } = req
  const { queryOption } = body
  const client = await req.getMongoClient()
  console.debug({ body, client })
  res.status(200).json({ queryOption, params, url, query, headers })
})

router.post('/:server/:db/:table/:page/aggregate', async (req, res) => {
  const { body, params, url, query, headers } = req
  const { aggregateOption } = body
  const client = await req.getMongoClient()
  console.debug({ body, client })
  res.status(200).json({ aggregateOption, params, url, query, headers })
})

router.post('/:server/assignInfo', async (req, res) => {
  const { body, params, url, query, headers } = req
  const client = await req.createMongoClient(body)
  // const assignInfo = req.clientAssignInfo
  const status = await common.getDBStatus(client)
  const dbStats = await common.getDBStats(client)
  // console.debug({ body, client, status, assignInfo })
  res.status(200).json({ status, dbStats, body, params, url, query, headers })
})

module.exports = router
