<template lang="pug">
  q-page.flex.flex-center
    img(
      alt='Quasar logo'
      src='~assets/quasar-logo-full.svg'
      )
    q-dialog(
      v-model='showServerConfigDialog'
      persistent
      )
      q-card(style='min-width:40vw')
        q-toolbar
          q-avatar
            img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
          q-toolbar-title
            span.text-weight-bold Create new server connection
          //- q-btn(
            flat
            round
            dense
            icon='close'
            v-close-popup
            )
        q-card-section
          connnection-config(
            :editData='editingConfig'
            @saveConfig='saveConfig'
            @closeDialog='closeDialog'
            )
</template>

<script>
import _ from 'lodash'
import connnectionConfig from '../components/connnectionConfig'
import { mapMutations, mapState, mapGetters } from 'vuex'
export default {
  name: 'PageHome',
  components: { connnectionConfig },
  data() {
    return {}
  },
  computed: {
    ...mapState('master', ['showServerConfigDialog', 'editingConfig']),
    ...mapGetters('master', ['serverList', 'currentServer']),
    notAnyServerList() {
      return _.isNil(this.serverList) || this.serverList.length === 0
    },
  },
  methods: {
    ...mapMutations('master', ['setShowServerConfigDialog', 'saveServerConfig']),
    saveConfig(data) {
      this.saveServerConfig(data)
      this.setShowServerConfigDialog(false)
    },
    closeDialog() {
      this.setShowServerConfigDialog(false)
    },
  },
}
</script>
