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
  async getDatabaseStats(pathParams) {
    let data = await new API(`api/{serverName}/{database}/stats`, {
      pathParams,
    }).fetch(false)
    console.debug(`getDatabaseStats result is:`, data)
    return data
  },
  async getServerInfo(post) {
    let data = await new API(`api/{serverName}/connect`, {
      pathParams: { serverName: post.name },
      post,
    }).fetch(false)
    console.debug(`getServerInfo result is:`, data)
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
