<template lang="pug">
  q-page(:style-fn='myTweak')
    q-resize-observer(@resize='onResize')
    .q-pa-md(ref='mainContent')
      my-navigation(ref='header')
      //- q-breadcrumbs(ref='header')
        //- q-breadcrumbs-el(:label='navigation.server' icon='fas fa-desktop' :to='`/app/${navigation.server}`')
        //- q-breadcrumbs-el(:label='navigation.db' icon='fas fa-database' :to='`/app/${navigation.server}/${navigation.db}`')
        //- q-breadcrumbs-el(:label='navigation.table' icon='fas fa-table')
      
      q-toolbar(ref='toolbar')
        q-btn-group(spread)
          q-btn(:label='$t("search")' color='positive' @click='openSearchDialog')
          q-btn(label='find' color='info' @click='openFindDialog')
          q-btn(label='aggregate' color='warning' @click='openAggregateDialog')
        q-space
        q-icon(name='far fa-clock')
        | {{duration}} {{$t('sec')}}
        q-space
        q-input(
          v-model='perPageRecord'
          style='width:100px'
          :label='$t("pageSizeLabel")'
          debounce='500'
          dense
          )
        q-pagination(
          :value='currentPage'
          :max='pageMax'
          input
          @input='changePage'
          )
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
          @updateItemClick='updateItem'
          @removeItemClick='removeItem'
          @refreshItemClick='refreshPage'
          )
        document-view(
          v-if='displayMode==="document"'
          :dataRows='tableRows'
          :contentHeight='contentHeight'
          @refreshItemClick='refreshPage'
          )
        table-view(
          v-if='displayMode==="table"'
          :dataRows='tableRows'
          :contentHeight='contentHeight'
          @updateItemClick='updateItem'
          @removeItemClick='removeItem'
          @refreshItemClick='refreshPage'
          )
    query-dialog(
      v-if='openQuery'
      v-model='openQuery'
      :commandData.sync='commandData'
      :commandMode='commandMode'
      @submit='onQuerySubmit'
      )
    search-dialog(
      v-if='openSearch'
      v-model='openSearch'
      :commandData.sync='commandData'
      @submit='onQuerySubmit'
      )
    edit-dialog(
      v-if='openEdit'
      v-model='openEdit'
      :editTable='navigation.table'
      :editKey='editing._id'
      :editData='editing'
      @submit='editSave'
      )
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import myNavigation from '../components/myNavigation'
import listView from '../components/listView'
import documentView from '../components/documentView'
import tableView from '../components/tableView'
import queryDialog from '../components/queryDialog'
import searchDialog from '../components/searchDialog'
import editDialog from '../components/editDialog'
import tools from '../util/tools'
import notify from '../mixin/notify.js'
export default {
  name: 'PageTable',
  mixins: [notify],
  components: {
    myNavigation,
    listView,
    documentView,
    tableView,
    queryDialog,
    searchDialog,
    editDialog,
  },
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
      displayMode: 'list',
      displayModes: [
        { value: 'list', slot: 'list' },
        { value: 'table', slot: 'table' },
        { value: 'document', slot: 'document' },
      ],
      contentHeight: 100,
      openQuery: false,
      openSearch: false,
      openEdit: false,

      editing: null,
    }
  },
  computed: {
    ...mapState('master', ['pageSize', 'currentPage', 'commandMode', 'find', 'aggregate']),
    ...mapGetters('master', ['tableRows', 'pageMax', 'duration']),
    navigation() {
      return _.get(this.$route, ['params'])
    },
    perPageRecord: {
      get() {
        return this.pageSize
      },
      set(v) {
        if (this.pageSize.toString() !== v) {
          this.setPageSize(v)
          this.changePageSize(v)
        }
      },
    },
    commandData: {
      get() {
        return _.get(this, [this.commandMode])
      },
      set(v) {
        console.debug(v)
        if (this.commandMode === 'find') {
          this.setFindCommand(v)
        } else {
          this.setAggregateCommand(v)
        }
      },
    },
  },
  methods: {
    ...mapMutations('master', ['setPageSize', 'setCommandMode', 'setFindCommand', 'setAggregateCommand']),
    ...mapActions('master', ['findTableData', 'aggregateTableData', 'deleteData', 'updateData']),
    changePage(page) {
      if (page !== this.currentPage) {
        // console.debug('changePage')
        // const { server, db, table } = _.get(this.$route, ['params'])
        // this.findTableData({ page, serverName: server, database: db, table })
        this.loadData(page)
      }
    },
    changePageSize(pageSize) {
      console.debug('pageSize', pageSize)
      this.refreshPage()
    },
    refreshPage() {
      this.loadData(this.currentPage)
    },
    loadData(page) {
      const { server, db, table } = _.get(this.$route, ['params'])
      if (this.commandMode === 'find') {
        this.findTableData({ page, serverName: server, database: db, table })
      } else {
        this.aggregateTableData({ page, serverName: server, database: db, table })
      }
    },
    openSearchDialog() {
      this.openSearch = true
      this.setCommandMode('find')
    },
    openFindDialog() {
      this.openQuery = true
      this.setCommandMode('find')
    },
    openAggregateDialog() {
      this.openQuery = true
      this.setCommandMode('aggregate')
    },
    updateItem(_id, updated) {
      console.debug('updateItem', { _id, updated })
      this.openEdit = true
      this.editing = updated
    },
    removeItem(_id) {
      const { server, db, table } = _.get(this.$route, ['params'])
      console.debug('removeItem', { server, db, table, _id })
      this.deleteData({ serverName: server, database: db, table, id: _id }).then(() => {
        this.$q.notify({
          type: 'positive',
          message: _.template(this.$t('document_delete_success'))({ id: _id }),
        })
        this.refreshPage()
        // const alertOption = {
        //   title: 'Correct',
        //   type: 'positive',
        //   autoClose: 1.5,
        //   message: `Record (${_id}) delete success!`,
        // }
        // this.showAlert(alertOption).onDismiss(() => this.refreshPage()
      })
    },
    editSave(_id, data, tb, options) {
      const { server, db, table } = _.get(this.$route, ['params'])
      console.debug('editSave', { server, db, table, _id, data })
      this.updateData({ serverName: server, database: db, table, id: _id, data, options }).then(() => {
        this.$q.notify({
          type: 'positive',
          message: _.template(this.$t('document_update_success'))({ id: _id }),
        })
        this.refreshPage()
        // const alertOption = {
        //   title: 'Correct',
        //   type: 'positive',
        //   autoClose: 1.5,
        //   message: `Record (${_id}) delete success!`,
        // }
        // this.showAlert(alertOption).onDismiss(() => this.refreshPage()
      })
    },
    onQuerySubmit() {
      // console.debug('onQuerySubmit')
      this.loadData(1)
    },
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
