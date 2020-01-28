// import consola from 'consola'
import _ from 'lodash'
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
    const { page, serverName, database, table, isReset } = params
    if (isReset) {
      commit('setFindCommand', {})
      commit('setCommandMode', 'find')
    }
    const result = await gobalAction.findTableData(
      { page, serverName, database, table },
      {
        findQuery: _.get(state, ['find', 'command']),
        options: _.get(state, ['find', 'options']),
        pageSize: state.pageSize,
      },
    )
    commit('setCurrentPage', page)
    commit(`setTableResult`, result)
  },
  async aggregateTableData({ commit, state }, params) {
    // const { assignId } = state
    // commit(`setSelectedDatabase`, { name: params.database })
    const { page, serverName, database, table, isReset } = params
    if (isReset) {
      commit('setAggregateCommand', {})
      commit('setCommandMode', 'aggregate')
    }
    const result = await gobalAction.aggregateTableData(
      { page, serverName, database, table },
      {
        aggregate: _.get(state, ['aggregate', 'command']),
        options: _.get(state, ['aggregate', 'options']),
        pageSize: state.pageSize,
      },
    )
    commit('setCurrentPage', page)
    commit(`setTableResult`, result)
  },
}
export default actions
