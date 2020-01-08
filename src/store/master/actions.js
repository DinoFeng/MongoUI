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
  },
}
export default actions
