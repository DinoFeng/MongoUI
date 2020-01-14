<template lang="pug">
  q-page(:style-fn="myTweak")
    .q-pa-md
      .q-pa-md
        q-card
          q-card-section Server status
          q-card-section 
            q-list.rounded-borders(bordered separator)
              q-item(
                v-for='s in selectedServerStates'
                :key='s.name'
                )
                q-item-section {{s.name}}
                q-item-section {{s.value}}
      .q-pa-md
        database-info(:databasesInfo='selectedDatabases')
</template>

<script>
// import _ from 'lodash'
import { mapGetters } from 'vuex'
import databaseInfo from '../components/databaseInfo'
export default {
  name: 'PageServer',
  components: { databaseInfo },
  data() {
    return {}
  },
  // preFetch({ store, currentRoute }) {
  //   // console.debug(_.get(currentRoute, ['params', 'server']))
  //   const serverName = _.get(currentRoute, ['params', 'server'])
  //   store.commit(`master/setSelectedServer`, serverName)
  //   console.debug(store.state)
  //   // return store.dispatch('master/connectServer', _.get(currentRoute, ['params', 'server']))
  // },
  // mounted() {
  //   this.connectServer(_.get(this.$route, ['params', 'server']))
  // },
  computed: {
    ...mapGetters('master', ['selectedDatabases', 'selectedServerStates']),
  },
  methods: {
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
