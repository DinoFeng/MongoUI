import _ from 'lodash'
const getters = {
  err(state) {
    return _.get(state, ['errors', 0])
  },
}
export default getters
