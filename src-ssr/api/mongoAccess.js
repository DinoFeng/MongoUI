const express = require('express')
const router = express.Router()
const common = require('../util/common')
const wrapAsync = require('./api').wrapAsync
const _ = require('lodash')
const eJson = require('mongodb-extjson')

router.post('/assign', async (req, res) => {
  res.status(200).json(common.genObjectId())
})

router.get('/buildNO', async (req, res) => {
  res.status(200).json(process.env.BUILDNUMBER)
})

router.get(
  '/:server/:db/:table/fields',
  wrapAsync(async req => {
    const { params } = req
    const { db, table, server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      return await common.getAllFieldsAndTypes(client, db, table)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// insert documents
router.post(
  '/:server/:db/:table/insert',
  wrapAsync(async req => {
    const { body, params } = req
    const { db, table, server } = params
    const { data } = body
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      return await common.insertData(client, db, table, eJson.parse(data))
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// update document
router.patch(
  '/:server/:db/:table/update',
  wrapAsync(async req => {
    const { body, params } = req
    const { db, table, server } = params
    const { id, data } = body
    const client = await req.getMongoClient(server)
    if (client) {
      // const data = await common.findData(client, db, table, findQuery, { page, pageSize }, options)
      return await common.updateData(client, db, table, eJson.parse(id), eJson.parse(data))
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// delete (all) document(s)
router.delete(
  '/:server/:db/:table/delete',
  wrapAsync(async req => {
    const { params, body } = req
    const { db, table, server } = params
    const { id } = body
    const client = await req.getMongoClient(server)
    if (client) {
      return await common.deleteData(client, db, table, eJson.parse(id))
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// duplicate collection
router.post(
  '/:server/:db/:table/duplicate',
  wrapAsync(async req => {
    const { params, body } = req
    const { db, table, server } = params
    const { newName } = body
    const client = await req.getMongoClient(server)
    if (newName && _.isString(newName)) {
      if (client) {
        return await common.cloneTable(client, db, table, newName)
      } else {
        throw new Error(`Mongo connection is null`)
      }
    } else {
      throw new Error(`Request newName params in body and newName must string.`)
    }
  }),
)

// create collection
router.post(
  '/:server/:db/:table/create',
  wrapAsync(async req => {
    const { params } = req
    const { db, table, server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common.createTable(client, db, table)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// drop collection
router.delete(
  '/:server/:db/:table/drop',
  wrapAsync(async req => {
    const { params } = req
    const { db, table, server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common.dropTable(client, db, table)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// rename collection
router.patch(
  '/:server/:db/:table/rename',
  wrapAsync(async req => {
    const { params, body } = req
    const { db, table, server } = params
    const { newName } = body
    if (newName && _.isString(newName)) {
      const client = await req.getMongoClient(server)
      if (client) {
        return await common.renameTable(client, db, table, newName)
      } else {
        throw new Error(`Mongo connection is null`)
      }
    } else {
      throw new Error(`Request newName params in body and newName must string.`)
    }
  }),
)

// drop database
router.delete(
  '/:server/:db/drop',
  wrapAsync(async req => {
    const { params } = req
    const { db, server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common.dropDatabase(client, db)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// Create Database
router.post(
  '/:server/:db/create',
  wrapAsync(async req => {
    const { params } = req
    const { db, server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common.createDatabase(client, db)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

router.post(
  '/:server/:db/:table/:page/find',
  wrapAsync(async req => {
    const { body, params } = req
    const { findQuery: qString, pageSize, options: opt } = body
    const findQuery = qString ? eJson.parse(qString) : {}
    const options = opt && eJson.parse(opt)
    // const { _fieldOptions } = opt || {}
    // const options = _.omit(opt, ['_fieldOptions'])
    const { db, table, page, server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common.findData(client, db, table, findQuery, { page, pageSize }, options)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

router.post(
  '/:server/:db/:table/:page/aggregate',
  wrapAsync(async req => {
    const { body, params } = req
    const { aggregate: qString, pageSize, options: opt } = body
    const { db, table, page, server } = params
    if (!qString) {
      throw new Error(`Please post 'aggregate' params`)
    }
    const aggregate = qString && eJson.parse(qString)
    const options = opt && eJson.parse(opt)

    const client = await req.getMongoClient(server)
    if (client) {
      return await common.aggregate(client, db, table, aggregate, { page, pageSize }, options)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// collection Statistics
router.get(
  '/:server/:db/:table/stats',
  wrapAsync(async req => {
    const { params } = req
    const { db, server, table } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common
        .getTableStats(client, db, table)
        .then(row => [row])
        .then(rows => ({
          rows: eJson.stringify(rows, { relaxed: true }),
          total: 1,
        }))
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

router.get(
  '/:server/:db/collections',
  wrapAsync(async req => {
    const { params } = req
    const { db, server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common.getCollections(client, db)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

router.get(
  '/:server/:db/stats',
  wrapAsync(async req => {
    const { params } = req
    const { db, server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common
        .getDBStats(client, db)
        .then(row => [row])
        .then(rows => ({
          rows: eJson.stringify(rows, { relaxed: true }),
          total: 1,
        }))
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

router.get(
  '/:server/status',
  wrapAsync(async req => {
    const { params } = req
    const { server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common
        .getServerStatus(client)
        .then(row => [row])
        .then(rows => ({
          rows: eJson.stringify(rows, { relaxed: true }),
          total: 1,
        }))
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// Host Info
router.get(
  '/:server/info',
  wrapAsync(async req => {
    const { params } = req
    const { server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common
        .getHostInfo(client)
        .then(row => [row])
        .then(rows => ({
          rows: eJson.stringify(rows, { relaxed: true }),
          total: 1,
        }))
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

// logs
router.get(
  '/:server/logs',
  wrapAsync(async req => {
    const { params } = req
    const { server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common
        .getLogs(client)
        .then(row => [row])
        .then(rows => ({
          rows: eJson.stringify(rows, { relaxed: true }),
          total: 1,
        }))
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

router.get(
  '/:server/stats',
  wrapAsync(async req => {
    const { params } = req
    const { server } = params
    const client = await req.getMongoClient(server)
    if (client) {
      return await common.getServerStatusAndCollections(client)
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

router.post(
  '/:server/connect',
  wrapAsync(async req => {
    const { params, body } = req
    const { server } = params
    const client = await req.createMongoClient(body, server)
    if (client) {
      return await common.getServerStatusAndCollections(client)
      // const status = await common.getServerStatus(client)
      // const { host, version, process, pid, uptime, localTime } = status
      // const { databases: dbs, totalSize, ok } = await common.getDBCollectionsStats(client)
      // const databases = dbs.map(({ name, sizeOnDisk, empty, tables }) => ({
      //   name,
      //   sizeOnDisk,
      //   empty,
      //   tables: tables.map(({ name, size, count }) => ({ name, size, count })),
      // }))
      // return {
      //   status: { host, version, process, pid, uptime, localTime },
      //   dbStatistics: { databases, totalSize, ok },
      // }
    } else {
      throw new Error(`Mongo connection is null`)
    }
  }),
)

module.exports = router
