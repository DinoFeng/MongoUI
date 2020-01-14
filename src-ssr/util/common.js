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
        // console.debug(dbList)
        const dbs = await Promise.all(
          dbList.databases.map(db =>
            this.getDBStats(client, db.name).then(result => _.merge({}, db, { tables: result })),
          ),
        )
        // console.debug(JSON.stringify(dbs, null, 2))
        return _.merge({}, dbList, { databases: dbs })
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
            .then(({ size, count }) => ({ name: coll.name, size, count })),
        ),
      )
      // console.debug(collStats)
      return collStats
    }
  },

  genObjectId() {
    const objID = new ObjectID()
    return objID.toHexString().toString()
  },
}

module.exports = common
