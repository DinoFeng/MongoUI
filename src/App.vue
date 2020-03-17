<template lang="pug">
  #q-app
    router-view
</template>

<script>
import assignManager from './util/assignManager'
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  mounted() {
    const version = window.navigator.language
    console.debug(version)
  },
  created() {
    this.loadServerConfig()
    assignManager.init()
  },
  methods: {
    ...mapMutations('master', ['loadServerConfig']),
  },
}
</script>
