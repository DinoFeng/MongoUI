// import tools from '../../util/tools.js'
import _ from 'lodash'
import { Object } from 'core-js'
const getters = {
  serverList(state) {
    return state.servers
  },
  selectedDatabases(state) {
    // return state.selectedServer
    return _.get(state.selectedServer, ['dbStatistics', 'databases']) || []
  },
  selectedServerStates(state) {
    const status = _.get(state.selectedServer, ['status']) || {}
    return Object.keys(status).map(k => ({ name: k, value: status[k] }))
  },
}
export default getters
