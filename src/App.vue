<template lang="pug">
  #q-app
    router-view
    q-inner-loading(
      :showing='appLoading'
      style='z-index: +9999;'
      )
      q-spinner-pie(size='50px' color='orange' )
</template>

<script>
import assignManager from './util/assignManager'
import notify from './mixin/notify.js'
import { mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  mixins: [notify],
  mounted() {
    // const version = window.navigator.language
    // console.debug(version)
    this.getVersion()
  },
  created() {
    this.loadServerConfig()
    assignManager.init()
  },
  computed: {
    ...mapGetters('errorHandle', ['err']),
    ...mapGetters('master', ['appLoading']),
  },
  methods: {
    ...mapMutations('master', ['loadServerConfig']),
    ...mapMutations('errorHandle', ['shiftError']),
    ...mapActions('master', ['getVersion']),
  },
  watch: {
    err: {
      handler: function(val) {
        if (val) {
          const { error, title, timeout, message } = val || {}
          this.showAlert({
            title: title || this.$t('error'),
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
