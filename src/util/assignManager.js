// import Vue from 'vue'
import axios from 'axios'
import tools from './tools'

const assignManager = {
  assignId: null,
  async init() {
    let assignId = tools.getAssignId()
    if (!assignId) {
      assignId = await axios
        .request({
          url: `/api/assign`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          method: 'post',
          data: {},
          timeout: 0,
        })
        .then(response => response.data)
        .catch(error => {
          console.error(error)
        })
      tools.saveAssignId(assignId)
    }
    this.assignId = assignId
  },
}
export default assignManager
