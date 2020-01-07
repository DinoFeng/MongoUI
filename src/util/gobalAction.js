import API from './api'

const actions = {
  async testUrl() {
    let data = await new API(`http://localhost:8080/api/test`, {
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
