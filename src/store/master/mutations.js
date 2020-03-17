import _ from 'lodash'
import tools from '../../util/tools.js'

const mutations = {
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
    }
  },
  saveConnectServer(state, data) {
    const orgData = _.cloneDeep(state.selectedServer)
    state.selectedServer = _.merge({}, orgData, data)
  },
  setSelectedDatabase(state, data) {
    state.selectedDatabase = _.cloneDeep(data)
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
