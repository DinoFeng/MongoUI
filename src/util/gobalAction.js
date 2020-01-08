import API from './api'
const baseHost = `http://localhost:8080`
const actions = {
  async getServerInfo(post) {
    let data = await new API(`${baseHost}/api/{serverName}/assignInfo`, {
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
