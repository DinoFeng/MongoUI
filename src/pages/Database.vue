<template lang="pug">
  q-page(:style-fn='myTweak')
    .q-pa-md
      my-navigation(ref='header')
      //- q-breadcrumbs
        //- q-breadcrumbs-el(:label='navigation.server' icon='fas fa-desktop' :to='`/app/${navigation.server}`')
        //- q-breadcrumbs-el(:label='navigation.db' icon='fas fa-database')
      database-info(
        :databasesInfo='selectedDatabaseInfo'
        )
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import myNavigation from '../components/myNavigation'
import databaseInfo from '../components/databaseInfo'
export default {
  name: 'PageDatabase',
  components: { databaseInfo, myNavigation },
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
  mounted() {},
  computed: {
    ...mapGetters('master', ['selectedDatabaseInfo']),
    navigation() {
      return _.get(this.$route, ['params'])
    },
  },
  methods: {
    // ...mapActions('master', ['findTableData']),
    myTweak(offset) {
      return { height: offset ? `calc(100vh - ${offset}px)` : '100vh', overflow: 'auto' }
    },
    // tableClick(database, table) {
    //   // console.debug('tableClick', table)
    //   const { server } = _.get(this.$route, ['params'])
    //   this.findTableData({ page: 1, serverName: server, database, table, isReset: true }).then(() =>
    //     this.$router.push({ name: 'table', params: { server, db: database, table } }),
    //   )
    // },
  },
}
</script>
