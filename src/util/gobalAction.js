import API from './api'
const baseHost = `http://localhost:8080`
const actions = {
  async findTableData(pathParams, post) {
    let data = await new API(`api/{serverName}/{database}/{table}/{page}/find`, {
      pathParams,
      post,
    }).fetch(false)
    console.debug(`findTableData result is:`, data)
    return data
  },
  async aggregateTableData(pathParams, post) {
    let data = await new API(`api/{serverName}/{database}/{table}/{page}/aggregate`, {
      pathParams,
      post,
    }).fetch(false)
    console.debug(`findTableData result is:`, data)
    return data
  },
  async getDatabaseStats(pathParams) {
    let data = await new API(`api/{serverName}/{database}/stats`, {
      pathParams,
      post: {},
    }).fetch(false)
    console.debug(`getDatabaseStats result is:`, data)
    return data
  },
  async getServerInfo(post) {
    let data = await new API(`api/{serverName}/assignInfo`, {
      pathParams: { serverName: post.name },
      post,
    }).fetch(false)
    console.debug(`getServerInfo result is:`, data)
    return data
  },
  async testUrl() {
    let data = await new API(`${baseHost}/api/test`, {
      post: {
        connString: 'mongodb://localhost:27017/',
        assignId: 'assignId',
      },
    }).fetch(false)
    console.debug(`testUrl result is:`, data)
    return data
  },
}

export default actions
