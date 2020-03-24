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
  async connectServer({ commit, state, dispatch }, serverName) {
    try {
      // const { assignId } = state
      commit(`setSelectedServer`, serverName)
      const serverConfig = await gobalAction.getServerInfo(state.selectedServer)
      console.info('connectServer', serverConfig, state.selectedServer)
      commit(`saveConnectServer`, serverConfig)
      return serverConfig
    } catch (error) {
      dispatch(
        'errorHandle/doPushError',
        {
          error,
        },
        { root: true },
      )
      commit(`setSelectedServer`, null)
      throw error
    }
  },
  async getDatabaseStats({ commit, dispatch }, params) {
    try {
      // const { assignId } = state
      // commit(`setSelectedDatabase`, { name: params.database })
      const dbStats = await gobalAction.getDatabaseStats(params)
      commit(`setSelectedDatabase`, { name: params.database, tables: dbStats })
      return dbStats
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async findTableData({ commit, state, dispatch }, params) {
    try {
      // const { assignId } = state
      // commit(`setSelectedDatabase`, { name: params.database })
      const { page, serverName, database, table, isReset } = params
      if (isReset) {
        commit('setFindCommand', {})
        commit('setCommandMode', 'find')
      }
      let context = {}
      const result = await gobalAction.findTableData(
        { page, serverName, database, table },
        {
          findQuery: _.get(state, ['find', 'command']),
          options: _.get(state, ['find', 'options']),
          pageSize: state.pageSize,
        },
        context,
      )
      commit('setCurrentPage', page)
      commit(`setTableResult`, result)
      commit('setDurationMs', _.get(context, ['durationMs']))
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async aggregateTableData({ commit, state, dispatch }, params) {
    try {
      // const { assignId } = state
      // commit(`setSelectedDatabase`, { name: params.database })
      const { page, serverName, database, table, isReset } = params
      if (isReset) {
        commit('setAggregateCommand', {})
        commit('setCommandMode', 'aggregate')
      }
      let context = {}
      const result = await gobalAction.aggregateTableData(
        { page, serverName, database, table },
        {
          aggregate: _.get(state, ['aggregate', 'command']),
          options: _.get(state, ['aggregate', 'options']),
          pageSize: state.pageSize,
        },
        context,
      )
      commit('setCurrentPage', page)
      commit(`setTableResult`, result)
      commit('setDurationMs', _.get(context, ['durationMs']))
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async deleteData({ dispatch }, params) {
    try {
      const { serverName, database, table, id } = params
      let context = {}
      const result = await gobalAction.deleteTableData({ serverName, database, table, id }, context)
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async updateData({ dispatch }, params) {
    try {
      const { serverName, database, table, id, data } = params
      let context = {}
      const result = await gobalAction.updateTableData({ serverName, database, table, id }, data, context)
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async insertData({ dispatch }, params) {
    try {
      const { serverName, database, table, data } = params
      let context = {}
      const result = await gobalAction.insertTableData({ serverName, database, table }, data, context)
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async getTabelStats({ dispatch, commit }, params) {
    try {
      const { serverName, database, table } = params
      let context = {}
      const result = await gobalAction.getTabelStats({ serverName, database, table }, context)
      commit(`setTableResult`, { rows: [result], total: 1 })
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async duplicateTable({ dispatch }, params) {
    try {
      const { serverName, database, table, newName } = params
      let context = {}
      const result = await gobalAction.duplicateTable({ serverName, database, table }, newName, context)
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async dropTable({ dispatch }, params) {
    try {
      const { serverName, database, table } = params
      let context = {}
      const result = await gobalAction.dropTable({ serverName, database, table }, context)
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
  async renameTable({ dispatch }, params) {
    try {
      const { serverName, database, table, newName } = params
      let context = {}
      const result = await gobalAction.renameTable({ serverName, database, table }, newName, context)
      return result
    } catch (error) {
      dispatch('errorHandle/doPushError', { error }, { root: true })
      throw error
    }
  },
}
export default actions
