<template lang="pug">
  #q-app
    router-view
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  created() {
    this.loadServerConfig()
  },
  methods: {
    ...mapMutations('master', ['loadServerConfig']),
  },
}
</script>
