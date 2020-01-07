<template lang="pug">
q-page.flex.flex-center
  div AAAAA
    | {{selectedServer}}
</template>

<script>
// import consola from 'consola'
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'PageServer',
  data() {
    return {}
  },
  mounted() {
    // consola.info(this.$route)
    this.connectServer(_.get(this.$route, ['params', 'server']))
  },
  computed: {
    ...mapState('master', ['selectedServer']),
    routerInfo() {
      return `SB`
      // return JSON.stringify(_.cloneDeep(this.$route))
    },
  },
  methods: {
    ...mapActions('master', ['connectServer']),
  },
}
</script>
