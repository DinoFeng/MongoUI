const { ObjectID } = require('mongodb')
const _ = require('lodash')

const COLLECTION_EXISTS = 'Collection with same name already exists.'
const SOURCE_NOT_EXISTS = `Source collection is't exists.`
const DATABASE_EXISTS = `<%=db%>.temp already exists.`

const genQuery = (orgQuery, fieldOptions) => {
  const objectIdFields = _.get(fieldOptions, ['objectIdFields'])
  if (objectIdFields && _.isArray(objectIdFields)) {
    // console.debug(objectIdFields)
    const q = objectIdFields.reduce((pre, cur) => _.merge(pre, { [cur]: ObjectID(orgQuery[cur]) }), {})
    // console.debug(JSON.stringify(q))
    // console.debug(_.merge({}, orgQuery, q))
    return _.merge({}, orgQuery, q)
  } else {
    return orgQuery
  }
}

const dataTransType = (orgData, options) => {
  console.debug(JSON.stringify(options))
  const objectIdFields = _.get(options, ['objectIdFields'])
  const dateFields = _.get(options, ['dateFields'])
  const result = _.cloneDeep(orgData)
  if (objectIdFields && _.isArray(objectIdFields)) {
    console.debug(JSON.stringify(objectIdFields))
    objectIdFields.forEach(field => _.set(result, field, ObjectID(_.get(orgData, field))))
  }
  if (dateFields && _.isArray(dateFields)) {
    console.debug(JSON.stringify(dateFields))
    dateFields.forEach(field => _.set(result, field, new Date(_.get(orgData, field))))
  }
  console.debug(JSON.stringify(result))
  return result
}

const common = {
  async getAllFieldsAndTypes(client, db, collection) {
    const table = client.db(db).collection(collection)
    const result = await table
      .mapReduce(
        function map() {
          for (var key in this) {
            // eslint-disable-next-line no-undef
            emit(key, null)
          }
        },
        // eslint-disable-next-line no-unused-vars
        function reduce(key, stuff) {
          return null
        },
        {
          limit: 20,
          out: { inline: 1 },
        },
      )
      .then(result => result.map(({ _id }) => _id))
    // console.debug(result)
    return result
  },

  async getServerStatusAndCollections(client) {
    const status = await this.getServerStatus(client)
    const { host, version, process, pid, uptime, localTime } = status
    const { databases: dbs, totalSize, ok } = await this.getDBCollectionsStats(client)
    const databases = dbs.map(({ name, sizeOnDisk, empty, tables }) => ({
      name,
      sizeOnDisk,
      empty,
      tables: tables.map(({ name, size, count }) => ({ name, size, count })),
    }))
    return {
      status: { host, version, process, pid, uptime, localTime },
      dbStatistics: { databases, totalSize, ok },
    }
  },

  async getDefaultDBName(client) {
    // console.debug({ getOptions: _.get(client, ['s', 'options']) })
    return _.get(client, ['s', 'options', 'dbName'])
  },

  async getServerStatus(client) {
    try {
      return await client
        .db()
        .admin()
        .serverStatus()
    } catch (error) {
      return error
    }
  },

  // client.db().stats()
  async getDBStats(client, dbName) {
    return client.db(dbName).stats()
  },

  async getDBCollectionsStats(client) {
    const defaultDB = await this.getDefaultDBName(client)
    // console.debug({ defaultDB })
    const adminDB = defaultDB ? client.db(defaultDB).admin() : client.db().admin()
    const dbList = await adminDB.listDatabases()
    if (dbList) {
      const skippedDBs = ['null', 'admin', 'local']
      const { databases: dbs, totalSize, ok } = dbList
      const databases = await Promise.all(
        dbs
          .filter(db => !skippedDBs.includes(db.name.toLowerCase()))
          .map(db => this.getCollections(client, db.name).then(result => _.merge({}, db, { tables: result }))),
      )
      return { databases, totalSize, ok }
    }
  },

  async getCollections(client, dbName) {
    const db = client.db(dbName)
    const collList = await db.listCollections().toArray()
    const collStats = await Promise.all(collList.map(coll => this.getTableStats(client, dbName, coll.name)))
    return collStats
  },

  async getTableStats(client, db, collection) {
    const table = client.db(db).collection(collection)
    try {
      return await table.stats().then(data => _.merge({ name: collection }, data))
    } catch (error) {
      return _.merge(error, { name: collection })
    }
  },

  genObjectId() {
    const objID = new ObjectID()
    return objID.toHexString().toString()
  },

  async updateData(client, db, collection, _id, data, options) {
    const table = client.db(db).collection(collection)
    delete data['_id']
    if (ObjectID.isValid(_id)) {
      return await table.update({ _id: ObjectID(_id) }, dataTransType(data, options))
    } else {
      return await table.update({ _id }, dataTransType(data, options))
    }
  },

  // async customerUpdateData(client, db, collection, _id, data) {
  //   const table = client.db(db).collection(collection)
  //   return await table.updateOne({ _id: ObjectID(_id) }, data)
  // },

  async insertData(client, db, collection, data, options) {
    const table = client.db(db).collection(collection)
    if (_.isArray(data)) {
      return await Promise.all(data.map(item => table.insertOne(dataTransType(item, options))))
    } else {
      return await table.insertOne(dataTransType(data, options))
    }
  },

  async deleteData(client, db, collection, _id) {
    const table = client.db(db).collection(collection)
    if (_.toNumber(_id) === -1) {
      return await table.deleteMany({})
    } else {
      if (ObjectID.isValid(_id)) {
        return await table.deleteOne({ _id: ObjectID(_id) })
      } else {
        return await table.deleteOne({ _id })
      }
    }
  },

  async cloneTable(client, db, source, target) {
    const table = client.db(db).collection(source)
    if (table) {
      if (await this.tableIsExists(client, db, target)) {
        throw new Error(COLLECTION_EXISTS)
      } else {
        const newTable = await table.aggregate([{ $match: {} }, { $out: target }]).next()
        return !!newTable
      }
    } else {
      throw new Error(SOURCE_NOT_EXISTS)
    }
  },

  async tableIsExists(client, db, collection) {
    const list = await client
      .db(db)
      .listCollections({ name: collection }, { nameOnly: true })
      .toArray()
    return list.length > 0
  },

  async createTable(client, db, collection, options) {
    if (await this.tableIsExists(client, db, collection)) {
      throw new Error(COLLECTION_EXISTS)
    } else {
      const database = client.db(db)
      const table = await database.createCollection(collection, options)
      return !!table
    }
  },

  async dropTable(client, db, collection, options) {
    const database = client.db(db)
    return await database.dropCollection(collection, options)
  },

  async renameTable(client, db, collection, newName, options) {
    const database = client.db(db)
    const table = await database.renameCollection(collection, newName, options)
    return !!table
  },

  async dropDatabase(client, db, options) {
    const database = client.db(db)
    return await database.dropDatabase(options)
  },

  async createDatabase(client, db) {
    try {
      await this.createTable(client, db, 'temp')
    } catch (error) {
      const { message } = error
      if (message === COLLECTION_EXISTS) {
        throw new Error(_.template(DATABASE_EXISTS)({ db }))
      } else {
        throw error
      }
    }
    this.dropTable(client, db, 'temp')
    return true
  },

  async getHostInfo(client) {
    const defaultDB = await this.getDefaultDBName(client)
    const database = defaultDB ? client.db(defaultDB).admin() : client.db().admin()
    // console.debug('OK', database)
    return await database.command({ hostInfo: 1 })
  },

  async getLogs(client) {
    const defaultDB = await this.getDefaultDBName(client)
    const database = defaultDB ? client.db(defaultDB).admin() : client.db().admin()
    // console.debug('OK', database)
    return await database.command({ getLog: 'global' })
  },

  async findData(client, db, collection, query, pageOptoins, options, fieldOptions) {
    // console.debug({ db, collection, query, options })
    const limit = (pageOptoins && pageOptoins.pageSize) || 20
    const page = (pageOptoins && pageOptoins.page) || 1
    const skip = (page - 1) * limit
    const opt = _.merge({}, options, { limit, skip })
    const table = client.db(db).collection(collection)
    // const rows = await table.find(query, opt).toArray()
    // const total = await table.find(query).count()
    const q = genQuery(query, fieldOptions)
    // console.debug(JSON.stringify({ q }))
    const [rows, total] = await Promise.all([table.find(q, opt).toArray(), table.find(q).count()])
    return { rows, total }
  },

  async aggregate(client, db, collection, aggregate, pageOptoins, options) {
    // console.debug({ db, collection, aggregate, pageOptoins, options })
    const limit = (pageOptoins && pageOptoins.pageSize) || 20
    const page = (pageOptoins && pageOptoins.page) || 1
    const skip = (page - 1) * limit
    const opt = _.merge({ cursor: { batchSize: 1 } }, options)
    const pipeline = []
    const totalPipeLine = []
    if (_.isArray(aggregate)) {
      pipeline.push(...aggregate)
      totalPipeLine.push(...aggregate)
    } else {
      pipeline.push(aggregate)
      totalPipeLine.push(aggregate)
    }
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })
    totalPipeLine.push({ $count: 'total' })
    const table = client.db(db).collection(collection)
    // console.debug({ pipeline, totalPipeLine })
    const [rows, [{ total }]] = await Promise.all([
      table.aggregate(pipeline, opt).toArray(),
      table
        .aggregate(totalPipeLine, { cursor: { batchSize: 1 } })
        .toArray()
        .then(res => (res && res.length > 0 ? res : [{ total: 0 }])),
    ])
    // const rows = await table.aggregate(pipeline, opt).toArray()
    // const [{ total }] = await table.aggregate(totalPipeLine, { cursor: { batchSize: 1 } }).toArray()
    return { rows, total }
  },
}

module.exports = common
