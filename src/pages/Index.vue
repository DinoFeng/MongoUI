<template lang="pug">
  q-page.flex.flex-center
    q-dialog(v-model='notAnyServerList')
      q-layout.bg-white(view='hHh lPr fFf', container)
        q-page-container
          q-page(padding)
            p(v-for='n in contentSize', :key='n')
              | {{ lorem }}
    //- img(
      alt='Quasar logo'
      src='~assets/quasar-logo-full.svg'
      )
</template>

<script>
import _ from 'lodash'
import tools from '../util/tools.js'
// import { mapGetters } from 'vuex'
export default {
  name: 'PageIndex',
  data() {
    return {
      moreContent: true,
      lorem:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!',
    }
  },
  computed: {
    // ...mapGetters('master', ['serverList', 'currentServer']),
    serverList() {
      return tools.getServerList()
    },
    // currentServer() {
    //   const currentServer = this.$q.localStorage.getItem('currentServer')
    //   if (currentServer) {
    //     return JSON.parse(currentServer)
    //   } else {
    //     return null
    //   }
    // },
    notAnyServerList() {
      return _.isNil(this.serverList) || this.serverList.length === 0
    },
    contentSize() {
      return this.moreContent ? 150 : 5
    },
  },
}
</script>
