// import consola from 'consola'
import gobalAction from '../../util/gobalAction'
const actions = {
  async connectServer({ commit, state }, serverName) {
    commit(`setSelectedServer`, serverName)
    const serverConfig = await gobalAction.testUrl()
    console.info('connectServer', serverConfig, state.selectedServer)
  },
}
export default actions
