<template lang="pug">
  #q-app
    router-view
</template>

<script>
import assignManager from './util/assignManager'
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  created() {
    this.loadServerConfig()
    assignManager.init()
  },
  methods: {
    ...mapMutations('master', ['loadServerConfig']),
  },
}
</script>
