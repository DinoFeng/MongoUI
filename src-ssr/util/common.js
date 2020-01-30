const { ObjectID } = require('mongodb')
const _ = require('lodash')

const common = {
  async getServerStatus(client) {
    return client
      .db()
      .admin()
      .serverStatus()
  },

  async getDBStats(client, dbName) {
    if (!dbName) {
      const adminDB = client.db().admin()
      const dbList = await adminDB.listDatabases()
      if (dbList) {
        const skippedDBs = ['null', 'admin', 'local']
        const { databases: dbs, totalSize, ok } = dbList
        const databases = await Promise.all(
          dbs
            .filter(db => !skippedDBs.includes(db.name.toLowerCase()))
            .map(db => this.getDBStats(client, db.name).then(result => _.merge({}, db, { tables: result }))),
        )
        return { databases, totalSize, ok }
      }
    } else {
      const db = client.db(dbName)
      const collList = await db.listCollections().toArray()
      const collStats = await Promise.all(
        collList.map(coll =>
          client
            .db(dbName)
            .collection(coll.name)
            .stats()
            .then(data => _.merge({ name: coll.name }, data)),
        ),
      )
      return collStats
    }
  },

  async getTableStats(client, db, collection) {
    const table = client.db(db).collection(collection)
    return await table.stats()
  },

  genObjectId() {
    const objID = new ObjectID()
    return objID.toHexString().toString()
  },

  async updateData(client, db, collection, _id, data) {
    const table = client.db(db).collection(collection)
    return await table.update({ _id: ObjectID(_id) }, data)
  },

  async customerUpdateData(client, db, collection, _id, data) {
    const table = client.db(db).collection(collection)
    return await table.updateOne({ _id: ObjectID(_id) }, data)
  },

  async insertData(client, db, collection, data) {
    const table = client.db(db).collection(collection)
    if (_.isArray(data)) {
      return await Promise.all(data.map(item => table.insertOne(item)))
    } else {
      return await table.insertOne(data)
    }
  },

  async deleteData(client, db, collection, _id) {
    const table = client.db(db).collection(collection)
    if (_.toNumber(_id) === -1) {
      return await table.deleteMany({})
    } else {
      return await table.deleteOne({ _id: ObjectID(_id) })
    }
  },

  async cloneTable(client, db, source, target) {
    const table = client.db(db).collection(source)
    await table.aggregate([{ $match: {} }, { $out: target }]).next()
    return true
  },

  async createTable(client, db, collection, options) {
    const database = client.db(db)
    await database.createCollection(collection, options)
    return true
  },

  async dropTable(client, db, collection, options) {
    const database = client.db(db)
    return await database.dropCollection(collection, options)
  },

  async renameTable(client, db, collection, newName, options) {
    const database = client.db(db)
    await database.renameCollection(collection, newName, options)
    return true
  },

  async dropDatabase(client, db, options) {
    const database = client.db(db)
    return await database.dropDatabase(options)
  },

  async createDatabase(client, db) {
    await this.createTable(client, db, 'temp')
    return true
  },

  async getHostInfo(client) {
    const database = client.db().admin()
    // const [serverInfo, buildInfo, profilingInfo] = await Promise.all([
    //   database.serverInfo(),
    //   database.buildInfo(),
    //   client.db().profilingInfo(),
    // ])
    // return { serverInfo, buildInfo, profilingInfo }
    return await database.serverInfo()
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
    const [rows, total] = await Promise.all([table.find(query, opt).toArray(), table.find(query).count()])
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
    const [rows, [{ total }]] = await Promise.all([
      table.aggregate(pipeline, opt).toArray(),
      table.aggregate(totalPipeLine, { cursor: { batchSize: 1 } }).toArray(),
    ])
    // const rows = await table.aggregate(pipeline, opt).toArray()
    // const [{ total }] = await table.aggregate(totalPipeLine, { cursor: { batchSize: 1 } }).toArray()
    return { rows, total }
  },
}

module.exports = common
