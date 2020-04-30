// import tools from '../../util/tools.js'
import _ from 'lodash'
import { Object } from 'core-js'
const getters = {
  appLoading(state) {
    return state.loading > 0
  },
  serverList(state) {
    return state.servers
  },
  selectedServerDBs(state) {
    // return state.selectedServer
    const remoteDBs = _.get(state.selectedServer, ['dbStatistics', 'databases'])
    const dbs = _.isArray(remoteDBs) ? [...remoteDBs] : []
    state.newDatabase.forEach(newDB => {
      if (dbs.findIndex(db => db.name === newDB) < 0) {
        dbs.push({ name: newDB })
      }
    })
    return dbs
  },
  selectedServerStates(state) {
    const status = _.get(state.selectedServer, ['status']) || {}
    return Object.keys(status).map(k => ({ name: k, value: status[k] }))
  },
  selectedDatabaseInfo(state) {
    return [state.selectedDatabase]
  },
  tableSchema(state) {
    return _.get(state, ['tableResult', 'schema']) || []
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
  resultFields(state) {
    const rows = _.get(state, ['tableResult', 'rows'])
    if (rows.length > 0) {
      const fields = new Set()
      for (let i = 0; i < rows.length; i++) {
        const doc = rows[i]
        for (const key in doc) {
          if (key === '__v') continue
          fields.add(key)
        }
      }
      return Array.from(fields)
    }
    return []
  },
  duration(state) {
    const ms = state.durationMs
    return Math.round(ms) / 1e3
  },
  // resultColumns(state) {
  //   const rows = _.get(state, ['tableResult', 'rows'])
  //   if (rows.length > 0) {
  //     const fields = new Map()
  //     for (let i = 0; i < rows.length; i++) {
  //       const doc = rows[i]
  //       for (const key in doc) {
  //         // if (key === '__v') continue
  //         fields.set(key, {
  //           name: key,
  //           label: key,
  //           align: 'left',
  //           field: row => {
  //             const type = tools.getType(row[key])
  //             if (['Object', 'Array'].includes(type)) {
  //               return type
  //             } else {
  //               return row[key]
  //             }
  //           },
  //         })
  //       }
  //     }
  //     return Array.from(fields.values)
  //   }
  //   return []
  // },
}
export default getters
