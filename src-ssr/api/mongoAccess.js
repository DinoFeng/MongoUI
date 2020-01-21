const express = require('express')
const router = express.Router()
const common = require('../util/common')
// const _ = require('lodash')

router.post('/:server/:db/:table/:page/find', async (req, res) => {
  try {
    const { body, params } = req
    let { findQuery, pageSize, options } = body
    const { db, table, page } = params
    findQuery = findQuery || {}
    const client = await req.getMongoClient()
    if (client) {
      const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      res.status(200).json(data)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

router.post('/:server/:db/:table/:page/aggregate', async (req, res) => {
  try {
    const { body, params } = req
    let { aggregate, pageSize, options } = body
    const { db, table, page } = params
    if (!aggregate) {
      throw new Error(`Please post 'aggregate' params`)
    }
    const client = await req.getMongoClient()
    if (client) {
      const data = await common.aggregate(client, db, table, aggregate, { page, pageSize }, options)
      res.status(200).json(data)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

router.post('/:server/:db/stats', async (req, res) => {
  try {
    const { params } = req
    const { db } = params
    const client = await req.getMongoClient()
    if (client) {
      const dbStatistics = await common.getDBStats(client, db)
      res.status(200).json(dbStatistics)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

router.post('/:server/stats', async (req, res) => {
  try {
    const client = await req.getMongoClient()
    if (client) {
      const dbStatistics = await common.getDBStats(client)
      res.status(200).json(dbStatistics)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

router.post('/:server/status', async (req, res) => {
  try {
    const client = await req.getMongoClient()
    if (client) {
      const status = await common.getServerStatus(client)
      res.status(200).json(status)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

router.post('/:server/assignInfo', async (req, res) => {
  try {
    const { body } = req
    const client = await req.createMongoClient(body)
    if (client) {
      const status = await common.getServerStatus(client)
      const { host, version, process, pid, uptime, localTime } = status
      const { databases: dbs, totalSize, ok } = await common.getDBStats(client)
      const databases = dbs.map(({ name, sizeOnDisk, empty, tables }) => ({
        name,
        sizeOnDisk,
        empty,
        tables: tables.map(({ name, size, count }) => ({ name, size, count })),
      }))
      res.status(200).json({
        status: { host, version, process, pid, uptime, localTime },
        dbStatistics: { databases, totalSize, ok },
      })
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

module.exports = router
