<template lang="pug">
  #q-app
    router-view
</template>

<script>
import assignManager from './util/assignManager'
import notify from './mixin/notify.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'App',
  mixins: [notify],
  mounted() {
    const version = window.navigator.language
    console.debug(version)
  },
  created() {
    this.loadServerConfig()
    assignManager.init()
  },
  computed: {
    ...mapGetters('errorHandle', ['err']),
  },
  methods: {
    ...mapMutations('master', ['loadServerConfig']),
    ...mapMutations('errorHandle', ['shiftError']),
  },
  watch: {
    err: {
      handler: function(val) {
        if (val) {
          const { error, title, timeout, message } = val || {}
          this.showAlert({
            title: title || 'Error',
            type: 'negative',
            message: message || error.message,
            detail: error.stack,
            autoClose: timeout,
          })
          this.shiftError()
        }
      },
      immediate: true,
    },
  },
}
</script>
