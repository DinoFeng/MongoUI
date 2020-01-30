const express = require('express')
const router = express.Router()
const common = require('../util/common')
const wrapAsync = require('./api').wrapAsync
// const _ = require('lodash')

// insert documents
router.post('/:server/:db/:table/insert', async (req, res) => {
  try {
    const { body, params } = req
    const { db, table, server } = params
    // findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      res.status(200).json({ type: 'Insert Documents', db, table, body })
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

// update document
router.patch(
  '/:server/:db/:table/:id/update',
  wrapAsync(async req => {
    // try {
    const { body, params } = req
    const { db, table, id, server } = params
    // findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      return { type: 'Update Document', db, table, id, body }
    } else {
      throw new Error(`Mongo connection is null`)
    }
    // } catch (error) {
    //   const { name, message, stack } = error
    //   res.status(500).json({ error: { name, message, stack } })
    // }
  }),
)

// delete (all) document(s)
router.delete('/:server/:db/:table/:id/delete', async (req, res) => {
  try {
    const { params } = req
    const { db, table, id, server } = params
    // findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      res.status(200).json({ type: id === '-1' ? 'Remove All Documents' : 'Remove Document', db, table, id })
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

// duplicate collection
router.post('/:server/:db/:table/duplicate', async (req, res) => {
  try {
    const { params } = req
    const { db, table, server } = params
    // findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      res.status(200).json({ type: 'Duplicate Collection', db, table })
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

// drop collection
router.delete('/:server/:db/:table/drop', async (req, res) => {
  try {
    const { params } = req
    const { db, table, server } = params
    // findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      res.status(200).json({ type: 'Drop Collection', db, table })
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

// rename collection
router.patch('/:server/:db/:table/rename', async (req, res) => {
  try {
    const { params, body } = req
    const { db, table, server } = params
    // findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      res.status(200).json({ type: 'Rename Collection', db, table, body })
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

// drop database
router.delete('/:server/:db/drop', async (req, res) => {
  try {
    const { params } = req
    const { db, server } = params
    // findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      res.status(200).json({ type: 'Drop Database', db })
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

// Create Database
router.post('/:server/:db/create', async (req, res) => {
  try {
    const { params } = req
    const { db, server } = params
    // findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      res.status(200).json({ type: 'Create Database', db })
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

router.post('/:server/:db/:table/:page/find', async (req, res) => {
  try {
    const { body, params } = req
    let { findQuery, pageSize, options } = body
    const { db, table, page, server } = params
    findQuery = findQuery || {}
    const client = await req.getMongoClient(server)
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
    const { db, table, page, server } = params
    if (!aggregate) {
      throw new Error(`Please post 'aggregate' params`)
    }
    const client = await req.getMongoClient(server)
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

// collection Statistics
router.post('/:server/:db/:table/stats', async (req, res) => {
  try {
    const { params } = req
    const { db, server, table } = params
    const client = await req.getMongoClient(server)
    if (client) {
      // const dbStatistics = await common.getDBStats(client, db)
      // res.status(200).json(dbStatistics)
      res.status(200).json({ type: 'collection Statistics', db, table })
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
    const { db, server } = params
    const client = await req.getMongoClient(server)
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
    const { params } = req
    const { server } = params
    const client = await req.getMongoClient(server)
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
    const { params } = req
    const { server } = params
    const client = await req.getMongoClient(server)
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

// Host Info
router.post('/:server/info', async (req, res) => {
  try {
    const { params } = req
    const { server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      // const status = await common.getServerStatus(client)
      // res.status(200).json(status)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  } catch (error) {
    const { name, message, stack } = error
    res.status(500).json({ error: { name, message, stack } })
  }
})

router.post('/:server/connect', async (req, res) => {
  try {
    const { params, body } = req
    const { server } = params
    const client = await req.createMongoClient(body, server)
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
