import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import master from './master'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // refrence:https://vuex.vuejs.org/zh/guide/strict.html
  modules: {
    master,
  },
})
// export default (/* { ssrContext } */) => {
//   const Store = new Vuex.Store({
//     modules: {
//       // example
//       master,
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode only
//     strict: process.env.DEV,
//   })

//   return Store
// }
export default store
