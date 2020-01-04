import tools from '../../util/tools.js'

const mutations = {
  setShowServerConfigDialog(state, val) {
    state.showServerConfigDialog = val
  },
  setLeftDrawerOpen(state, val) {
    state.leftDrawerOpen = val
  },
  loadServerConfig(state) {
    state.servers = tools.getServerList()
  },
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
  setEditingConfig(state, val) {
    state.editingConfig = val
  },
}
export default mutations