const { MongoClient } = require('mongodb')
const DateTime = require('luxon').DateTime
const _ = require('lodash')

const pool = Symbol('pool')
const max = Symbol('max')
const expireTime = Symbol('expireTime')
const clearPool = Symbol('clearPool')
const genConnection = Symbol('genConnection')
const removeClient = Symbol('removeClient')
const appendClient = Symbol('appendClient')

const createConnection = (connString, connOptions) =>
  new Promise((resolve, reject) => {
    MongoClient.connect(connString, connOptions, (err, database) => {
      if (err) {
        reject(err)
      } else {
        resolve(database)
      }
    })
  })

class ConnectionPool {
  constructor() {
    this[max] = 20
    this[expireTime] = 1000 * 60 * 60 * 12
    this[pool] = new Map()
  }

  [clearPool]() {
    console.info('clearPool')
    console.info(this[pool])
  }
  [removeClient](id) {
    console.info(`before removeClient ${id}`, this[pool])
    if (id && this[pool].has(id)) {
      this[pool].delete(id)
    }
    console.info(`after removeClient ${id}`, this[pool])
  }
  [appendClient](id, client, connOptions) {
    // console.info(`before appendClient ${id}`, this[pool])
    if (id && this[pool].has(id)) {
      const { aId, client: oldClient, connOptions: oldOptions } = this[pool].get(id)
      if (aId) {
        clearTimeout(aId)
      }
      if (JSON.stringify(connOptions) != JSON.stringify(oldOptions) && oldClient) {
        oldClient.close()
      }
    }
    const accessTime = DateTime.local()
    const aId = setTimeout(() => {
      client.close()
      this[removeClient](id)
      // console.debug(`close at ${DateTime.local().toString()}`)
    }, this[expireTime])
    this[pool].set(id, { client, accessTime, aId, connOptions })
    // console.debug(`set at ${accessTime.toString()}`)
    // console.info(`after appendClient ${id}`, this[pool])
  }

  async [genConnection](assignId, serverInfo) {
    try {
      const { connString, options, includeAdmin } = serverInfo
      // const objID = new ObjectID()
      // const assignId = objID.toHexString().toString()
      const client = new MongoClient(connString, _.merge({ useUnifiedTopology: true }, options))
      // client.on('close', () => {
      //   this[removeClient](assignId)
      //   console.warn('client closed')
      // })
      // client.on('reconnect', () => {
      //   this[appendClient](assignId, client)
      //   console.warn('client reconnect')
      // })
      // client.on('error', error => console.error('client error', error))
      const connect = await client.connect()
      // const connect = await createConnection(
      //   connString,
      //   options,
      //   // _.merge({ useUnifiedTopology: true, auto_reconnect: true }, options),
      // )

      if (this[pool].size >= this[max]) {
        this[clearPool]()
      }
      this[appendClient](assignId, connect, { connString, options, extOptions: { includeAdmin } })
      return connect
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getMongoClient(assignId) {
    if (assignId && this[pool].has(assignId)) {
      const { client, connOptions } = this[pool].get(assignId)
      this[appendClient](assignId, client, connOptions)
      return client
    } else {
      return null
    }
  }

  async getMongoClientWithInfo(assignId) {
    if (assignId && this[pool].has(assignId)) {
      const { client, connOptions } = this[pool].get(assignId)
      this[appendClient](assignId, client, connOptions)
      return { client, connOptions }
    } else {
      return null
    }
  }

  async createMongoClient(assignId, serverInfo) {
    const { connString } = serverInfo || {}
    if (assignId && connString) {
      const client = await this[genConnection](assignId, serverInfo)
      return client
    } else {
      return null
    }
  }
}

module.exports = ConnectionPool
