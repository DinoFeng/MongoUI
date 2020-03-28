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
import Vue from 'vue'
import assignManager from './util/assignManager'
import notify from './mixin/notify.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'App',
  mixins: [notify],
  created() {
    this.loadServerConfig()
    Vue.prototype.$axios
      .request({
        url: './statics/config/config.json',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .then(response => response.data)
      .then(cfgs => {
        console.debug(cfgs)
        this.setVersion(cfgs.version)
        assignManager.init(cfgs.baseHost)
      })
      .catch(error => {
        const { message, stack } = error
        this.showAlert({
          title: this.$t('error'),
          type: 'negative',
          message: message,
          detail: stack,
        })
      })
  },
  computed: {
    ...mapGetters('errorHandle', ['err']),
    ...mapGetters('master', ['appLoading']),
  },
  methods: {
    ...mapMutations('master', ['loadServerConfig', 'setVersion']),
    ...mapMutations('errorHandle', ['shiftError']),
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
