const { ObjectID } = require('mongodb')
const eJson = require('mongodb-extjson')
// const parseSchema = require('mongodb-schema')
const _ = require('lodash')

const COLLECTION_EXISTS = 'Collection with same name already exists.'
const SOURCE_NOT_EXISTS = `Source collection is't exists.`
const DATABASE_EXISTS = `<%=db%>.temp already exists.`

// const genQuery = (orgQuery, fieldOptions) => {
//   const objectIdFields = _.get(fieldOptions, ['objectIdFields'])
//   if (objectIdFields && _.isArray(objectIdFields)) {
//     // console.debug(objectIdFields)
//     const q = objectIdFields.reduce((pre, cur) => _.merge(pre, { [cur]: ObjectID(orgQuery[cur]) }), {})
//     // console.debug(JSON.stringify(q))
//     // console.debug(_.merge({}, orgQuery, q))
//     return _.merge({}, orgQuery, q)
//   } else {
//     return orgQuery
//   }
// }

// const dataTransType = (orgData, options) => {
//   console.debug(JSON.stringify(options))
//   const objectIdFields = _.get(options, ['objectIdFields'])
//   const dateFields = _.get(options, ['dateFields'])
//   const result = _.cloneDeep(orgData)
//   if (objectIdFields && _.isArray(objectIdFields)) {
//     console.debug(JSON.stringify(objectIdFields))
//     objectIdFields.forEach(field => _.set(result, field, ObjectID(_.get(orgData, field))))
//   }
//   if (dateFields && _.isArray(dateFields)) {
//     console.debug(JSON.stringify(dateFields))
//     dateFields.forEach(field => _.set(result, field, new Date(_.get(orgData, field))))
//   }
//   console.debug(JSON.stringify(result))
//   return result
// }

const common = {
  // async parseDataSchema(data) {
  //   return new Promise((resolve, reject) => {
  //     parseSchema(data, (error, schema) => {
  //       if (error) reject(error)
  //       // console.debug({ s: schema })
  //       return resolve(schema)
  //     })
  //   })
  // },

  // compressSchemaType(typeObject, typeNames) {
  //   const { bsonType, type, fields, values, count, types } = typeObject
  //   const result = { bsonType, type, values: Array.from(new Set(values)) }
  //   if (_.isArray(types)) {
  //     _.merge(result, { types: types.map(t => this.compressSchemaType(t, type)) })
  //   }
  //   if (fields) {
  //     _.merge(result, this.compressSchema({ fields }))
  //   }
  //   // if (_.isArray(typeNames) && _.isArray(values)) {
  //   // if (typeNames.filter(v => v.toLowerCase() !== 'Undefined'.toLowerCase()).length > 1) {
  //   // _.merge(result, { values: Array.from(new Set(values)) })
  //   // }
  //   // }
  //   return result
  // },

  // compressSchema(schema) {
  //   // console.debug({ schema })
  //   const { fields } = schema
  //   return {
  //     fields: fields
  //       // .map(({ name, path, types, type }) => {
  //       //   return {
  //       //     name,
  //       //     path,
  //       //     types: types.map(t => this.compressSchemaType(t, type)),
  //       //     type,
  //       //   }
  //       // })
  //       .reduce(
  //         (pre, { name, path, types, type }) =>
  //           _.merge({}, pre, {
  //             [name]: {
  //               path,
  //               types: types.map(t => this.compressSchemaType(t, type)),
  //               type,
  //             },
  //           }),
  //         {},
  //       ),
  //   }
  // },

  // async getAllFieldsAndTypes(client, db, collection) {
  //   const table = client.db(db).collection(collection)
  //   const result = await table
  //     .mapReduce(
  //       function map() {
  //         for (var key in this) {
  //           // eslint-disable-next-line no-undef
  //           emit(key, null)
  //         }
  //       },
  //       // eslint-disable-next-line no-unused-vars
  //       function reduce(key, stuff) {
  //         return null
  //       },
  //       {
  //         limit: 20,
  //         out: { inline: 1 },
  //       },
  //     )
  //     .then(result => result.map(({ _id }) => _id))
  //   // console.debug(result)
  //   return result
  // },

  async getServerStatusAndCollections(client) {
    console.debug('getServerStatusAndCollections')
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
      console.debug('getServerStatus')
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
    console.debug('getDBStats', { dbName })
    const datas = client.db(dbName).stats()
    // const schema = await this.parseDataSchema(datas)
    // console.debug({ schema })
    return datas
  },

  async getDBCollectionsStats(client) {
    const defaultDB = await this.getDefaultDBName(client)
    // console.debug({ defaultDB })
    const adminDB = defaultDB ? client.db(defaultDB).admin() : client.db().admin()
    const dbList = await adminDB.listDatabases()
    if (dbList) {
      const skippedDBs = ['null', 'admin', 'local', 'config']
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
    try {
      const db = client.db(dbName)
      console.debug('getCollections', { dbName })

      const collList = await db.listCollections().toArray()
      const collStats = await Promise.all(collList.map(coll => this.getTableStats(client, dbName, coll.name)))
      return collStats
    } catch (error) {
      console.error('getCollections', error)
      return [{}]
    }
  },

  async getTableStats(client, db, collection) {
    const table = client.db(db).collection(collection)
    try {
      // console.debug('getTableStats', { db, collection })
      return await table.stats().then(data => _.merge({ name: collection }, data))
    } catch (error) {
      return _.merge(error, { name: collection })
    }
  },

  genObjectId() {
    const objID = new ObjectID()
    return objID.toHexString().toString()
  },

  async updateData(client, db, collection, _id, data) {
    const table = client.db(db).collection(collection)
    delete data['_id']
    // if (ObjectID.isValid(_id)) {
    //   return await table.update({ _id: ObjectID(_id) }, dataTransType(data, options))
    // } else {
    //   return await table.update({ _id }, dataTransType(data, options))
    // }
    console.debug('updateData', { db, collection, _id, data })
    return await table.update(_id, data)
    // return await table.updateOne(_id, data)
  },

  // async customerUpdateData(client, db, collection, _id, data) {
  //   const table = client.db(db).collection(collection)
  //   return await table.updateOne({ _id: ObjectID(_id) }, data)
  // },

  async insertData(client, db, collection, data) {
    const table = client.db(db).collection(collection)
    // if (_.isArray(data)) {
    //   return await Promise.all(data.map(item => table.insertOne(dataTransType(item, options))))
    // } else {
    //   return await table.insertOne(dataTransType(data, options))
    // }
    console.debug('insertData', { db, collection, data })
    return await table.insertOne(data)
  },

  async deleteData(client, db, collection, _id) {
    const table = client.db(db).collection(collection)
    console.debug('deleteData', { db, collection, _id })
    if (_.isPlainObject(_id) && _.isEmpty(_id)) {
      return await table.deleteMany(_id)
    } else {
      // if (ObjectID.isValid(_id)) {
      //   return await table.deleteOne({ _id: ObjectID(_id) })
      // } else {
      return await table.deleteOne(_id)
      // }
    }
  },

  async cloneTable(client, db, source, target) {
    const table = client.db(db).collection(source)
    if (table) {
      if (await this.tableIsExists(client, db, target)) {
        throw new Error(COLLECTION_EXISTS)
      } else {
        console.debug('cloneTable', { db, source, target })
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
      console.debug('createTable', { db, collection, options })
      const table = await database.createCollection(collection, options)
      return !!table
    }
  },

  async dropTable(client, db, collection, options) {
    const database = client.db(db)
    console.debug('dropTable', { db, collection, options })
    return await database.dropCollection(collection, options)
  },

  async renameTable(client, db, collection, newName, options) {
    const database = client.db(db)
    console.debug('renameTable', { db, collection, newName, options })
    const table = await database.renameCollection(collection, newName, options)
    return !!table
  },

  async dropDatabase(client, db, options) {
    const database = client.db(db)
    console.debug('dropDatabase', { db, options })
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
    console.debug({ hostInfo: 1 })
    return await database.command({ hostInfo: 1 })
  },

  async getLogs(client) {
    const defaultDB = await this.getDefaultDBName(client)
    const database = defaultDB ? client.db(defaultDB).admin() : client.db().admin()
    console.debug({ getLog: 'global' })
    return await database.command({ getLog: 'global' })
  },

  async findData(client, db, collection, query, pageOptoins, options) {
    // console.debug({ db, collection, query, options })
    const limit = (pageOptoins && pageOptoins.pageSize) || 20
    const page = (pageOptoins && pageOptoins.page) || 1
    const skip = (page - 1) * limit
    const opt = _.merge({}, options, { limit, skip })
    const table = client.db(db).collection(collection)
    // const rows = await table.find(query, opt).toArray()
    // const total = await table.find(query).count()
    // const q = genQuery(query, fieldOptions)
    console.debug('findData', { query, opt })
    // console.debug(JSON.stringify({ q }))
    // const datas = table.find(query, opt)
    // .skip(skip)
    // .limit(limit)
    // const schema = await this.parseDataSchema(datas).then(s => this.compressSchema(s))
    const [rows, total] = await Promise.all([
      table
        .find(query, opt)
        .toArray()
        .then(r => eJson.stringify(r, { relaxed: true })),
      table.find(query).count(),
    ])
    return { rows, total }
  },

  async aggregate(client, db, collection, aggregate, pageOptoins, options) {
    // console.debug({ db, collection, aggregate, pageOptoins, options })
    const limit = (pageOptoins && pageOptoins.pageSize) || 20
    const page = (pageOptoins && pageOptoins.page) || 1
    const skip = (page - 1) * limit
    const opt = _.merge({ cursor: { batchSize: limit } }, options)
    const pipeline = []
    const totalPipeLine = []
    if (_.isArray(aggregate)) {
      pipeline.push(...aggregate)
      // totalPipeLine.push(...aggregate)
    } else {
      pipeline.push(aggregate)
      // totalPipeLine.push(aggregate)
    }
    totalPipeLine.push(...pipeline)
    totalPipeLine.push({ $count: 'total' })

    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    console.debug('aggregate', { pipeline, opt })

    const table = client.db(db).collection(collection)
    // console.debug({ pipeline, totalPipeLine })
    // const datas = table.aggregate(pipeline, opt)
    // const schema = await this.parseDataSchema(datas).then(s => this.compressSchema(s))
    const [rows, [{ total }]] = await Promise.all([
      table
        .aggregate(pipeline, opt)
        .toArray()
        .then(r => eJson.stringify(r, { relaxed: true })),
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
