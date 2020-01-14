<template lang="pug">
  q-page.flex.flex-center
    span AAA
    img(
      alt='Quasar logo'
      src='~assets/quasar-logo-full.svg'
      )
</template>

<script>
// import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import databaseInfo from '../components/databaseInfo'
export default {
  name: 'PageTable',
  components: { databaseInfo },
  // preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
  //   // fetch data, validate route and optionally redirect to some other route...

  //   // ssrContext is available only server-side in SSR mode

  //   // No access to "this" here as preFetch() is called before
  //   // the component gets instantiated.

  //   // Return a Promise if you are running an async job
  //   // Example:
  //   // return store.dispatch('fetchItem', currentRoute.params.id)
  //   consola.info({ currentRoute, previousRoute })
  // },
  mounted() {
    // this.connectServer(_.get(this.$route, ['params', 'server']))
    console.info(this.$route.params)
  },
  computed: {
    ...mapGetters('master', ['selectedDatabases', 'selectedServerStates']),
  },
  methods: {
    ...mapActions('master', ['connectServer']),
    myTweak(offset) {
      // console.debug({ offset })
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration
      // this.setAppHeaderHeight(offset)
      // this is actually what the default style-fn does in Quasar
      return { height: offset ? `calc(100vh - ${offset}px)` : '100vh', overflow: 'auto' }
    },
  },
}
</script>
