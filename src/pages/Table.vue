<template lang="pug">
  q-page(:style-fn='myTweak')
    q-resize-observer(@resize='onResize')
    .q-pa-md(ref='mainContent')
      q-breadcrumbs(ref='header')
        q-breadcrumbs-el(:label='navigation.server' icon='fas fa-desktop' :to='`/app/${navigation.server}`')
        q-breadcrumbs-el(:label='navigation.db' icon='fas fa-database' :to='`/app/${navigation.server}/${navigation.db}`')
        q-breadcrumbs-el(:label='navigation.table' icon='fas fa-table')
      
      q-toolbar(ref='toolbar')
        q-btn-group(spread)
          q-btn(label='search' color='positive')
          q-btn(label='find' color='info')
          q-btn(label='aggregate' color='warning')
        q-space
        q-icon(name='far fa-clock')
        | 0.002 sec
        q-space
        q-input(
          v-model='pageSize'
          style='width:100px'
          label='Records per page:'
          dense
          )
        q-pagination(
          v-model='current'
          :max='pageMax'
          input
          )
        q-separator(vertical inset)
        q-btn-toggle(
          v-model='displayMode'
          flat
          toggle-color='primary'
          :options='displayModes'
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
          )
        document-view(
          v-if='displayMode==="document"'
          :dataRows='tableRows'
          :contentHeight='contentHeight'
          )
        table-view(
          v-if='displayMode==="table"'
          :dataRows='tableRows'
          :contentHeight='contentHeight'
          )
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import listView from '../components/listView'
import documentView from '../components/documentView'
import tableView from '../components/tableView'
import tools from '../util/tools'
export default {
  name: 'PageTable',
  components: { listView, documentView, tableView },
  // preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
  //   // fetch data, validate route and optionally redirect to some other route...

  //   // ssrContext is available only server-side in SSR mode

  //   // No access to "this" here as preFetch() is called before
  //   // the component gets instantiated.

  //   // Return a Promise if you are running an async job
  //   // Example:
  //   // return store.dispatch('fetchItem', currentRoute.params.id)
  //   consola.info({ currentRoute, previousRoute })
  // },
  mounted() {},
  data() {
    return {
      tab: 'find',
      current: 1,
      pageSize: 20,
      displayMode: 'list',
      displayModes: [
        { value: 'list', slot: 'list' },
        { value: 'table', slot: 'table' },
        { value: 'document', slot: 'document' },
      ],
      aggregate: '',
      find: '',
      contentHeight: 100,
    }
  },
  computed: {
    ...mapGetters('master', ['tableRows', 'pageMax']),
    navigation() {
      return _.get(this.$route, ['params'])
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
