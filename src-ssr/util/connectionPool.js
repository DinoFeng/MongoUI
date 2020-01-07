const { MongoClient, ObjectID } = require('mongodb')
// const DateTime = require('luxon').DateTime
// const _ = require('lodash')

const pool = Symbol('pool')
const max = Symbol('max')
const clearPool = Symbol('clearPool')
const genConnection = Symbol('genConnection')
// const addToPool = Symbol('addToPool')
class ConnectionPool {
  constructor() {
    this[max] = 2
    this[pool] = new Map()
  }

  [clearPool]() {
    console.info('clearPool')
  }
  async [genConnection](connString, options) {
    try {
      console.debug({ connString, options })
      const client = new MongoClient(connString, options)
      client.on('close', () => console.warn('client closed'))
      client.on('connect', () => console.warn('client connect'))
      client.on('error', error => console.error('client error', error))
      const connection = await client.connect()
      connection.on('close', () => console.warn('Connection closed'))
      connection.on('connect', () => console.warn('Connection connect'))
      connection.on('reconnect', () => console.warn('Connection reconnect'))
      connection.on('error', error => console.error('connection error', error))
      const assignId = new ObjectID()
      const x = assignId.toHexString().toString()
      console.debug({ x })
      return { assignId: x, client, connection }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async assignConnection(agv) {
    // const accessTime = DateTime.local()
    const { assignId: id, connString, options } = agv
    if (id && this[pool].has(id)) {
      const { client, connection } = this[pool].get(id)
      return { assignId: id, client, connection }
    } else {
      const { assignId, client, connection } = await this[genConnection](connString, options)
      // console.debug({ assignId, client, connection })
      if (this[pool].size >= this[max]) {
        this[clearPool]()
      }
      this[pool].set(assignId, { client, connection })
      return { assignId, client, connection }
    }
  }
}

module.exports = ConnectionPool
