import state from './state'
import getters from './getters'
import mutations from './mutations'
import mutationActions from './mutation-actions'
import actions from './actions'

export default {
  namespaced: true,
  getters,
  mutations,
  actions: {
    ...actions,
    ...mutationActions,
  },
  state,
}
