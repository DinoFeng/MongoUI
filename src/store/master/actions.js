// import consola from 'consola'
import gobalAction from '../../util/gobalAction'
const actions = {
  // async getAssignId({ commit, state }) {
  //   commit(`loadAssignId`)
  //   if (!state.assignId) {
  //     const assignId = await gobalAction.getAssignId()
  //     commit('saveAssignId', assignId)
  //   }
  // },
  async connectServer({ commit, state }, serverName) {
    // const { assignId } = state
    commit(`setSelectedServer`, serverName)
    const serverConfig = await gobalAction.getServerInfo(state.selectedServer)
    console.info('connectServer', serverConfig, state.selectedServer)
    commit(`saveConnectServer`, serverConfig)
  },
  async getDatabaseStats({ commit }, params) {
    // const { assignId } = state
    // commit(`setSelectedDatabase`, { name: params.database })
    const dbStats = await gobalAction.getDatabaseStats(params)
    commit(`setSelectedDatabase`, { name: params.database, tables: dbStats })
  },
  async findTableData({ commit, state }, params) {
    // const { assignId } = state
    // commit(`setSelectedDatabase`, { name: params.database })
    const { page, serverName, database, table } = params
    const result = await gobalAction.findTableData(
      { page, serverName, database, table },
      { findQuery: state.findQuery, options: state.findOptions, pageSize: state.pageSize },
    )
    commit(`setTableResult`, result)
  },
}
export default actions
