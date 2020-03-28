import axios from 'axios'
import tools from './tools'
const { baseHost } = require('../statics/config/config').default
const assignManager = {
  assignId: null,
  async init() {
    let assignId = tools.getAssignId()
    if (!assignId) {
      assignId = await axios
        .request({
          url: `${baseHost}/api/assign`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'post',
          data: {},
          timeout: 0,
        })
        .then(response => response.data)
      tools.saveAssignId(assignId)
    }
    this.assignId = assignId
  },
}
export default assignManager
