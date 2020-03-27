import _ from 'lodash'
import tools from '../../util/tools.js'

const mutations = {
  setLoading(state, loading) {
    state.loading = loading
  },
  setLeftDrawerOpen(state, val) {
    state.leftDrawerOpen = val
  },
  loadServerConfig(state) {
    state.servers = tools.getServerList()
  },
  // loadAssignId(state) {
  //   state.assignId = tools.getAssignId()
  // },
  // saveAssignId(state, assignId) {
  //   state.assignId = assignId
  //   tools.saveAssignId(state.assignId)
  // },
  saveServerConfig(state, val) {
    if (val) {
      const p = state.servers.findIndex(item => item.name === val.name)
      if (p >= 0) {
        state.servers.splice(p, 1, val)
      } else {
        state.servers.push(val)
      }
      tools.saveServerConfigToLocal(state.servers)
    }
  },
  deleteServerConfig(state, serverName) {
    if (serverName) {
      const p = state.servers.findIndex(item => item.name === serverName)
      if (p >= 0) {
        state.servers.splice(p, 1)
        tools.saveServerConfigToLocal(state.servers)
      }
    }
  },
  setSelectedServer(state, serverName) {
    if (serverName) {
      const p = state.servers.findIndex(item => item.name === serverName)
      if (p >= 0) {
        state.selectedServer = state.servers[p]
      } else {
        state.selectedServer = null
      }
    } else {
      state.selectedServer = null
    }
  },
  saveConnectServer(state, data) {
    const { connString, name, options } = _.cloneDeep(state.selectedServer)
    state.selectedServer = _.merge({ connString, name, options }, data)
    const existsDatabases = _.get(state.selectedServer, ['dbStatistics', 'databases'])
    let i = 0
    while (i < state.newDatabase.length) {
      if (existsDatabases.findIndex(db => db.name === state.newDatabase[i]) >= 0) {
        state.newDatabase.splice(i, 1)
      } else {
        ++i
      }
    }
  },
  addNewDatabase(state, database) {
    const newDB = new Set(state.newDatabase)
    newDB.add(database)
    state.newDatabase = Array.from(newDB) || []
  },
  removeNewDatabase(state, database) {
    const newDB = new Set(state.newDatabase)
    newDB.delete(database)
    state.newDatabase = Array.from(newDB) || []
  },
  setSelectedDatabase(state, data) {
    state.selectedDatabase = _.cloneDeep(data)
    const db = state.selectedServer.dbStatistics.databases.find(item => item.name === data.name)
    if (db) {
      _.set(db, 'tables', data.tables)
    }
  },
  setTableResult(state, data) {
    state.tableResult = _.cloneDeep(data)
  },
  setPageSize(state, value) {
    state.pageSize = _.toNumber(value)
  },
  setCurrentPage(state, value) {
    state.currentPage = value
  },
  setCommandMode(state, value) {
    state.commandMode = value
  },
  setFindCommand(state, data) {
    state.find = _.cloneDeep(data)
  },
  setAggregateCommand(state, data) {
    state.aggregate = _.cloneDeep(data)
  },
  setDurationMs(state, value) {
    state.durationMs = _.toNumber(value)
  },
  setInsertDocumentEvent(state) {
    state.insertDocumentEvent = !state.insertDocumentEvent
  },
}
export default mutations
