import API from './api'
import _ from 'lodash'
// const baseHost = `http://localhost:8080`
const actions = {
  async findTableData(pathParams, post, context) {
    const api = new API(`api/{serverName}/{database}/{table}/{page}/find`, {
      pathParams,
      post,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`findTableData durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async aggregateTableData(pathParams, post, context) {
    const api = new API(`api/{serverName}/{database}/{table}/{page}/aggregate`, {
      pathParams,
      post,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`aggregateTableData durationMs:${api.durationMs} `, data)
    return data
  },
  async getDatabaseCollections(pathParams) {
    let data = await new API(`api/{serverName}/{database}/collections`, {
      pathParams,
    }).fetch(false)
    console.debug(`getDatabaseCollections result is:`, data)
    return data
  },
  async connectServer(post) {
    let data = await new API(`api/{serverName}/connect`, {
      pathParams: { serverName: post.name },
      post,
    }).fetch(false)
    console.debug(`connectServer result is:`, data)
    return data
  },
  async deleteTableData(pathParams, context) {
    const api = new API(`api/{serverName}/{database}/{table}/{id}/delete`, {
      pathParams,
      method: 'DELETE',
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`deleteTableData durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async updateTableData(pathParams, post, context) {
    const api = new API(`api/{serverName}/{database}/{table}/{id}/update`, {
      pathParams,
      post,
      method: 'PATCH',
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`updateTableData durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async insertTableData(pathParams, post, context) {
    const api = new API(`api/{serverName}/{database}/{table}/insert`, {
      pathParams,
      post,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`insertTableData durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async getTabelStats(pathParams, context) {
    const api = new API(`api/{serverName}/{database}/{table}/stats`, {
      pathParams,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`getTabelStats durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async duplicateTable(pathParams, newName, context) {
    const api = new API(`api/{serverName}/{database}/{table}/duplicate`, {
      pathParams,
      post: { newName },
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`duplicateTable durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async dropTable(pathParams, context) {
    const api = new API(`api/{serverName}/{database}/{table}/drop`, {
      pathParams,
      method: 'DELETE',
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`dropTable durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async createTable(pathParams, context) {
    const api = new API(`api/{serverName}/{database}/{table}/create`, {
      pathParams,
      post: {},
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`createTable durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async renameTable(pathParams, newName, context) {
    const api = new API(`api/{serverName}/{database}/{table}/rename`, {
      pathParams,
      post: { newName },
      method: 'patch',
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`renameTable durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async getDatabaseStats(pathParams, context) {
    const api = new API(`api/{serverName}/{database}/stats`, {
      pathParams,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`getDatabaseStats durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async getServerStatus(pathParams, context) {
    const api = new API(`api/{serverName}/status`, {
      pathParams,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`getServerStatus durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async getServerHostInfo(pathParams, context) {
    const api = new API(`api/{serverName}/info`, {
      pathParams,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`getServerHostInfo durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async getServerLogs(pathParams, context) {
    const api = new API(`api/{serverName}/logs`, {
      pathParams,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`getServerLogs durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async getServerStats(pathParams, context) {
    const api = new API(`api/{serverName}/stats`, {
      pathParams,
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`getServerStats durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async createDatabase(pathParams, context) {
    const api = new API(`api/{serverName}/{database}/create`, {
      pathParams,
      post: {},
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`createDatabase durationMs:${api.durationMs} result is:`, data)
    return data
  },
  async dropDatabase(pathParams, context) {
    const api = new API(`api/{serverName}/{database}/drop`, {
      pathParams,
      method: 'DELETE',
    })
    const data = await api.fetch(false)
    if (context) {
      _.merge(context, { durationMs: api.durationMs })
    }
    console.debug(`dropDatabase durationMs:${api.durationMs} result is:`, data)
    return data
  },
  // async testUrl() {
  //   let data = await new API(`${baseHost}/api/test`, {
  //     post: {
  //       connString: 'mongodb://localhost:27017/',
  //       assignId: 'assignId',
  //     },
  //   }).fetch(false)
  //   console.debug(`testUrl result is:`, data)
  //   return data
  // },
}

export default actions
