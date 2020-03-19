const actions = {
  doPushError: {
    // root: true,
    handler({ commit }, err) {
      // console.debug(err)
      commit('pushError', err)
    },
  },
}
export default actions
