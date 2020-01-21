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

  genObjectId() {
    const objID = new ObjectID()
    return objID.toHexString().toString()
  },

  async findData(client, db, collection, query, pageOptoins, options) {
    // console.debug({ db, collection, query, options })
    const limit = (pageOptoins && pageOptoins.pageSize) || 20
    const page = (pageOptoins && pageOptoins.page) || 1
    const skip = (page - 1) * limit
    const opt = _.merge({}, options, { limit, skip })
    const table = client.db(db).collection(collection)
    const rows = await table.find(query, opt).toArray()
    const total = await table.count(query)
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
    const rows = await table.aggregate(pipeline, opt).toArray()
    const [{ total }] = await table.aggregate(totalPipeLine, { cursor: { batchSize: 1 } }).toArray()
    return { rows, total }
  },
}

module.exports = common
