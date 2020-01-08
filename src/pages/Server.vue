<template lang="pug">
q-page.flex.flex-center
  div AAAAA
    | {{selectedServer}}
</template>

<script>
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'PageServer',
  data() {
    return {}
  },
  mounted() {
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
