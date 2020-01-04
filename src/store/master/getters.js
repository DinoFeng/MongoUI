// import tools from '../../util/tools.js'
const getters = {
  serverList(state) {
    return state.servers
  },
  selectedServer(state) {
    return state.selectedServer
  },
}
export default getters
