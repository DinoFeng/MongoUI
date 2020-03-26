<template lang="pug">
  q-page(:style-fn='myTweak')
    q-resize-observer(@resize='onResize')
    .q-pa-md(ref='mainContent')
      q-breadcrumbs(ref='header')
        q-breadcrumbs-el(:label='navigation.server' icon='fas fa-desktop' :to='`/app/${navigation.server}`')
        q-breadcrumbs-el(v-if='!!navigation.db' :label='navigation.db' icon='fas fa-database' :to='`/app/${navigation.server}/${navigation.db}`')
        q-breadcrumbs-el(v-if='!!navigation.table' :label='navigation.table' icon='fas fa-table' :to='`/app/${navigation.server}/${navigation.db}/${navigation.table}`')
        q-breadcrumbs-el(:label='label' icon='list_alt')
      .q-pa-md(ref='bodyContent')
        list-view(
          :dataRows='tableRows'
          :contentHeight='contentHeight'
          )
</template>

<script>
import _ from 'lodash'
import tools from '../util/tools'
import { mapGetters } from 'vuex'
import listView from '../components/listView'
export default {
  name: 'PageStatistics',
  components: {
    listView,
  },
  data() {
    return {
      contentHeight: 100,
    }
  },
  computed: {
    ...mapGetters('master', ['tableRows']),
    navigation() {
      return _.get(this.$route, ['params'])
    },
    label() {
      const n = {
        serverHost: 'HostInfo',
        serverStatistics: 'Statics',
        databaseStatistics: 'Statics',
        tableStatistics: 'Statics',
      }
      return n[_.get(this.$route, ['name'])]
    },
  },
  methods: {
    myTweak(offset) {
      return { height: offset ? `calc(100vh - ${offset}px)` : '100vh', overflow: 'auto' }
    },
    onResize(size) {
      const mainPadding = tools.getPaddingValue(this.$refs.mainContent)
      const bodyPadding = tools.getPaddingValue(this.$refs.bodyContent)
      // console.debug(mainPadding, bodyPadding)
      const headerSize = tools.getEleSizeValue(this.$refs.header.$el)
      // const toolbarSize = tools.getEleSizeValue(this.$refs.toolbar.$el)
      this.contentHeight =
        size.height -
        (headerSize.height +
          // toolbarSize.height +
          mainPadding.top +
          mainPadding.bottom +
          bodyPadding.top +
          bodyPadding.bottom)
    },
  },
}
</script>
