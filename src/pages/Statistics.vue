<template lang="pug">
  q-page(:style-fn='myTweak')
    q-resize-observer(@resize='onResize')
    .q-pa-md(ref='mainContent')
      q-breadcrumbs(ref='header')
        q-breadcrumbs-el(:label='navigation.server' icon='fas fa-desktop' :to='`/app/${navigation.server}`')
        q-breadcrumbs-el(v-if='!!navigation.db' :label='navigation.db' icon='fas fa-database' :to='`/app/${navigation.server}/${navigation.db}`')
        q-breadcrumbs-el(v-if='!!navigation.table' :label='navigation.table' icon='fas fa-table' :to='`/app/${navigation.server}/${navigation.db}/${navigation.table}`')
        q-breadcrumbs-el(:label='label' icon='list_alt')
      q-toolbar(ref='toolbar')
        q-space
        q-separator(vertical inset)
        q-btn-toggle(
          v-model='displayMode'
          :options='displayModes'
          toggle-color='primary'
          flat
          )
          template(v-slot:list)
            q-icon(name='fas fa-list')
          template(v-slot:table)
            q-icon(name='fas fa-th')
          template(v-slot:document)
            q-icon(name='fas fa-file')
    
      .q-pa-md(ref='bodyContent')
        list-view(
          v-if='displayMode==="list"'
          :dataRows='tableRows'
          :contentHeight='contentHeight'
          hideFreshMenu
          )
        document-view(
          v-if='displayMode==="document"'
          :dataRows='tableRows'
          :contentHeight='contentHeight'
          hideFreshMenu
          )
        table-view(
          v-if='displayMode==="table"'
          :dataRows='tableRows'
          :contentHeight='contentHeight'
          hideFreshMenu
          )
</template>

<script>
import _ from 'lodash'
import tools from '../util/tools'
import { mapGetters } from 'vuex'
import listView from '../components/listView'
import documentView from '../components/documentView'
import tableView from '../components/tableView'
export default {
  name: 'PageStatistics',
  components: {
    listView,
    documentView,
    tableView,
  },
  data() {
    return {
      contentHeight: 100,
      displayMode: 'list',
      displayModes: [
        { value: 'list', slot: 'list' },
        { value: 'table', slot: 'table' },
        { value: 'document', slot: 'document' },
      ],
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
      const toolbarSize = tools.getEleSizeValue(this.$refs.toolbar.$el)
      this.contentHeight =
        size.height -
        (headerSize.height +
          toolbarSize.height +
          mainPadding.top +
          mainPadding.bottom +
          bodyPadding.top +
          bodyPadding.bottom)
    },
  },
}
</script>
