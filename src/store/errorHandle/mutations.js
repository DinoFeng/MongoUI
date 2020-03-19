const mutations = {
  shiftError(state) {
    state.errors.shift()
  },
  pushError(state, err) {
    // console.debug(err)
    state.errors.push(err)
  },
}
export default mutations
