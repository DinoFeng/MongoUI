// import tools from '../../util/tools.js'
import _ from 'lodash'
import { Object } from 'core-js'
const getters = {
  serverList(state) {
    return state.servers
  },
  selectedServerDBs(state) {
    // return state.selectedServer
    return _.get(state.selectedServer, ['dbStatistics', 'databases']) || []
  },
  selectedServerStates(state) {
    const status = _.get(state.selectedServer, ['status']) || {}
    return Object.keys(status).map(k => ({ name: k, value: status[k] }))
  },
  selectedDatabaseInfo(state) {
    return [state.selectedDatabase]
  },
  tableRows(state) {
    return _.get(state, ['tableResult', 'rows']) || []
  },
  pageMax(state) {
    const total = _.get(state, ['tableResult', 'total'])
    return Math.ceil(total / state.pageSize)
  },
  pagination(state) {
    return {
      page: state.currentPage,
      rowsPerPage: state.pageSize,
      rowsNumber: _.get(state, ['tableResult', 'total']) || 0,
    }
  },
}
export default getters
