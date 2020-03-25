<template lang="pug">
  main
    q-drawer(
      :value='leftDrawerOpen'
      show-if-above
      bordered
      content-class='bg-grey-2'
      )
      q-scroll-area.fit
        q-list
          q-expansion-item(
            expand-icon-toggle
            expand-separator
            group="somegroup"
            :value='!selectedServer'
            :content-inset-level='0.3'
            )
            template(v-slot:header)
              q-item-section(avatar)
                q-icon(name='fas fa-server')
              q-item-section
                q-item-label Servers
                q-item-label(caption)
              q-item-section(top side)
                .text-grey-8.q-gutter-xs
                  q-btn.gt-xs(
                    icon='add'
                    size='12px' 
                    flat 
                    dense 
                    round 
                    @click='()=>showServerConfigDialog(true)'
                    )
            q-list
              q-item(
                v-for='server in serverList'
                :key='server.name'
                )
                q-item-section(avatar)
                  q-icon(name='fas fa-desktop')
                q-item-section
                  q-item-label {{server.name}}
                  q-item-label(caption)
                q-item-section(top side)
                  .text-grey-8.q-gutter-xs
                    q-btn.gt-xs(
                      icon='fas fa-hands-helping'
                      size='10px' 
                      flat 
                      dense 
                      round 
                      @click='()=>serverConnect(server.name)'
                      )
                    q-btn.gt-xs(size='12px' flat dense round icon='more_vert')
                      q-menu(fit anchor='bottom left' self='top left')
                        q-item(clickable)
                          q-item-section
                            .text-grey-8.q-gutter-xs
                              q-btn.gt-xs(
                                icon='delete'
                                size='12px' 
                                flat 
                                dense 
                                round 
                                @click='()=>deleteServerConfig(server.name)'
                                )
                        q-item(clickable)
                          q-item-section
                            .text-grey-8.q-gutter-xs
                              q-btn.gt-xs(
                                icon='edit'
                                size='12px' 
                                flat 
                                dense 
                                round 
                                @click='()=>showServerConfigDialog(false,server)'
                                )
                        q-item(clickable)
                          q-item-section
                            .text-grey-8.q-gutter-xs
                              q-btn.gt-xs(
                                size='10px' 
                                flat 
                                dense 
                                round 
                                icon='fas fa-clone'
                                @click='()=>showServerConfigDialog(true,server)'
                                )
          q-expansion-item(
            v-if='selectedServer'
            expand-icon-toggle
            expand-separator
            group="somegroup"
            :value='!!selectedServer'
            :content-inset-level='0.3'
            )
            template(v-slot:header)
              q-item-section(avatar)
                q-icon(name='fas fa-desktop')
              q-item-section
                q-item-label {{selectedServer.name}}
                q-item-label(caption)
              q-menu(
                touch-position
                context-menu
                )
                q-list(dense style="min-width: 100px")
                  q-item(
                    clickable 
                    v-close-popup
                    @click='()=>menuServerRefresh(selectedServer.name)'
                    )
                    q-item-section {{$t('menu.refresh')}}
                  q-separator
                  q-item(
                    clickable 
                    v-close-popup
                    @click='()=>menuCreateDatabase(selectedServer.name)'
                    )
                    q-item-section {{$t('menu.createDatabase')}}
                  q-separator
                  q-item(
                    clickable 
                    v-close-popup
                    @click='()=>menuServerStatus(selectedServer.name)'
                    )
                    q-item-section {{$t('menu.serverStatus')}}
                  q-item(
                    clickable 
                    v-close-popup
                    @click='()=>menuHostInfo(selectedServer.name)'
                    )
                    q-item-section {{$t('menu.hostInfo')}}
                  q-separator
                  q-item(
                    clickable 
                    v-close-popup
                    @click='()=>menuShowLog(selectedServer.name)'
                    )
                    q-item-section {{$t('menu.showLog')}}
            database-items(
              :databases='selectedServerDBs'
              @dbClick='dbClick'
              @tableClick='tableClick'

              @menuDatabaseRefresh='menuDatabaseRefresh'
              @menuDatabaseStatistics='menuDatabaseStatistics'
              @menuDropDatabase='menuDropDatabase'
              @menuCreateCollection='menuCreateCollection'

              @menuInsertDoc='menuInsertDoc'
              @menuRemoveAllDoc='menuRemoveAllDoc'
              @menuRenameCollection='menuRenameCollection'
              @menuDuplicateCollection='menuDuplicateCollection'
              @menuDropCollection='menuDropCollection'
              @menuCollectionStatistics='menuCollectionStatistics'
              )
    q-page-container
      router-view
    server-config-dialog(
      v-model='serverConfigShow'
      :editData='editingConfig'
      )
    edit-dialog(
      v-if='openEdit'
      v-model='openEdit'
      :editTable='editingTable'
      :editKey='editing._id'
      :editData='editing'
      @submit='editSave'
      )
</template>

<script>
import _ from 'lodash'
import serverConfigDialog from '../components/serverConfigDialog'
import databaseItems from '../components/databaseItemsForDrawer'
import editDialog from '../components/editDialog'
import notify from '../mixin/notify.js'
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  components: {
    serverConfigDialog,
    databaseItems,
    editDialog,
  },
  mixins: [notify],
  data() {
    return {
      serverConfigShow: false,
      editingConfig: null,
      openEdit: false,
      editing: false,
      editingTable: null,
    }
  },
  mounted() {
    // const routeName = _.get(this.$route, ['name'])
    // console.debug({ routeName })
    if (this.serverList.length > 0) {
      this.serverConfigShow = false
      const { server, db, table } = _.get(this.$route, ['params'])
      // console.debug('index mounted', { server, db, table })
      if (server) {
        this.connectServer(server).then(() => {
          if (db) {
            if (table) {
              this.findTableData({ page: 1, serverName: server, database: db, table, isReset: true })
              // .then(() =>
              //   this.$router.push({ name: 'table', params: { server, db, table } }),
              // )
              // this.$router.push({ name: 'table', params: { server, db, table } })
            } else {
              this.getDatabaseCollections({ serverName: server, database: db })
              // .then(() =>
              //   this.$router.push({ name: 'database', params: { server, db } }),
              // )
            }
          }
        })
      }
      // else {
      //   this.$router.push({ name: 'home' })
      // }
    } else {
      this.serverConfigShow = true
    }
  },
  computed: {
    ...mapState('master', ['leftDrawerOpen', 'selectedServer', 'selectedDatabase']),
    ...mapGetters('master', ['serverList', 'selectedServerDBs']),
  },
  methods: {
    ...mapMutations('master', ['deleteServerConfig', 'setInsertDocumentEvent']),
    ...mapActions('master', [
      'connectServer',
      'getDatabaseCollections',
      'findTableData',
      'insertData',
      'getTabelStats',
      'duplicateTable',
      'dropTable',
      'deleteData',
      'renameTable',
      'createTable',
      'getDatabaseStats',
      'getServerStatus',
      'getServerHostInfo',
      'getServerLogs',
    ]),
    showServerConfigDialog(create, editData) {
      if (editData) {
        const { name, connString, options } = editData
        if (create) {
          this.editingConfig = { connString, options }
        } else {
          this.editingConfig = { name, connString, options }
        }
      } else {
        this.editingConfig = {}
      }
      this.serverConfigShow = true
    },
    serverConnect(serverName) {
      // window.location.href = `app/${serverName}`
      if (_.get(this.selectedServer, 'name') !== serverName) {
        this.connectServer(serverName).then(() => this.$router.push({ name: 'server', params: { server: serverName } }))
      }
    },
    dbClick(db, table) {
      // window.location.href = `app/${name}/${db}`
      const { name } = this.selectedServer
      const { server, db: oldDB, table: oldTable } = _.get(this.$route, ['params'])
      if (server !== name || db !== oldDB || table !== oldTable) {
        this.getDatabaseCollections({ serverName: name, database: db }).then(() =>
          this.$router.push({ name: 'database', params: { server: name, db } }),
        )
      }
    },
    tableClick(db, table) {
      // window.location.href = `app/${name}/${db}/${table}`
      const routeName = _.get(this.$route, ['name'])
      const { name } = this.selectedServer
      const { server, db: oldDB, table: oldTable } = _.get(this.$route, ['params'])
      if (routeName != 'table' || server !== name || db !== oldDB || table !== oldTable) {
        this.findTableData({ page: 1, serverName: name, database: db, table, isReset: true }).then(() =>
          this.$router.push({ name: 'table', params: { server: name, db, table } }),
        )
      }
    },
    menuServerRefresh(serverName) {
      console.debug('menuServerRefresh', serverName)
    },
    menuCreateDatabase(serverName) {
      console.debug('menuCreateDatabase', serverName)
    },
    menuServerStatus(serverName) {
      // console.debug('menuServerStatus', serverName)
      const { table, db } = {}
      const routeName = _.get(this.$route, ['name'])
      const { server, db: oldDB, table: oldTable } = _.get(this.$route, ['params'])
      if (routeName != 'serverStatistics' || server !== serverName || db !== oldDB || table !== oldTable) {
        this.getServerStatus({ serverName }).then(() =>
          this.$router.push({ name: 'serverStatistics', params: { server: serverName } }),
        )
      }
    },
    menuHostInfo(serverName) {
      // console.debug('menuHostInfo', serverName)
      const { table, db } = {}
      const routeName = _.get(this.$route, ['name'])
      const { server, db: oldDB, table: oldTable } = _.get(this.$route, ['params'])
      if (routeName != 'serverHost' || server !== serverName || db !== oldDB || table !== oldTable) {
        this.getServerHostInfo({ serverName }).then(() =>
          this.$router.push({ name: 'serverHost', params: { server: serverName } }),
        )
      }
    },
    menuShowLog(serverName) {
      console.debug('menuShowLog', serverName)
      const { table, db } = {}
      const routeName = _.get(this.$route, ['name'])
      const { server, db: oldDB, table: oldTable } = _.get(this.$route, ['params'])
      if (routeName != 'serverLogs' || server !== serverName || db !== oldDB || table !== oldTable) {
        this.getServerLogs({ serverName }).then(() =>
          this.$router.push({ name: 'serverLogs', params: { server: serverName } }),
        )
      }
    },
    menuDropDatabase(db) {
      console.debug('menuDropDatabase', db)
    },
    menuCreateCollection(db) {
      // console.debug('menuCreateCollection', db)
      this.showPrompt({
        title: this.$t('create_collection.title'),
        message: this.$t('create_collection.message'),
        validate: val => !!val || this.$t('create_collection.validateMSG'),
      }).onOk(table => {
        // console.debug('your enter is:', table)
        const { server } = _.get(this.$route, ['params'])
        this.createTable({ serverName: server, database: db, table }).then(() => {
          this.getDatabaseCollections({ serverName: server, database: db })
          this.$q.notify({
            type: 'positive',
            message: _.template(this.$t('create_collection.success'))({ table }),
          })
        })
      })
    },
    menuDatabaseRefresh(db) {
      // console.debug('menuDatabaseRefresh', db)
      const { server } = _.get(this.$route, ['params'])
      this.getDatabaseCollections({ serverName: server, database: db })
    },
    menuDatabaseStatistics(db) {
      const table = null
      // console.debug('menuDatabaseStatistics', db)
      const routeName = _.get(this.$route, ['name'])
      const { name } = this.selectedServer
      const { server, db: oldDB, table: oldTable } = _.get(this.$route, ['params'])
      if (routeName != 'databaseStatistics' || server !== name || db !== oldDB || table !== oldTable) {
        this.getDatabaseStats({ serverName: name, database: db }).then(() =>
          this.$router.push({ name: 'databaseStatistics', params: { server: name, db } }),
        )
      }
    },
    menuRenameCollection(db, table) {
      // console.debug('menuRenameCollection', { db, table })
      this.showPrompt({
        title: this.$t('rename_collection.title'),
        message: this.$t('rename_collection.message'),
        defaultValue: table,
        autoClose: 30,
      }).onOk(newName => {
        if (newName !== table) {
          const { server } = _.get(this.$route, ['params'])
          this.renameTable({ serverName: server, database: db, table, newName }).then(() => {
            this.getDatabaseCollections({ serverName: server, database: db })
            this.$q.notify({
              type: 'positive',
              message: _.template(this.$t('rename_collection.success'))({ table: newName }),
            })
          })
        } else {
          this.$q.notify({
            type: 'warning',
            message: this.$t('rename_collection.warning'),
          })
        }
      })
    },
    menuDuplicateCollection(db, table) {
      // console.debug('menuDuplicateCollection', { db, table })
      this.showPrompt({
        title: this.$t('duplicate_collection.title'),
        message: this.$t('duplicate_collection.message'),
        defaultValue: `${table}_copy`,
        autoClose: 30,
      }).onOk(newName => {
        if (newName !== table) {
          const { server } = _.get(this.$route, ['params'])
          this.duplicateTable({ serverName: server, database: db, table, newName }).then(() => {
            this.getDatabaseCollections({ serverName: server, database: db })
            this.$q.notify({
              type: 'positive',
              message: _.template(this.$t('duplicate_collection.success'))({ table: newName }),
            })
          })
        } else {
          this.$q.notify({
            type: 'warning',
            message: this.$t('duplicate_collection.warning'),
          })
        }
      })
    },
    menuDropCollection(db, table) {
      // console.debug('menuDropCollection', { db, table })
      this.showConfirm({
        title: this.$t('drop_collection.title'),
        message: _.template(this.$t('drop_collection.message'))({ table }),
        defaultCancel: true,
        okLabel: this.$t('drop_collection.ok'),
        cancelLabel: this.$t('drop_collection.cancel'),
      }).onOk(() => {
        const { server } = _.get(this.$route, ['params'])
        this.dropTable({ serverName: server, database: db, table }).then(() => {
          this.getDatabaseCollections({ serverName: server, database: db })
          this.$q.notify({
            type: 'positive',
            message: _.template(this.$t('drop_collection.success'))({ table }),
          })
        })
      })
    },
    menuCollectionStatistics(db, table) {
      // console.debug('menuStatistics', table)
      const routeName = _.get(this.$route, ['name'])
      const { name } = this.selectedServer
      const { server, db: oldDB, table: oldTable } = _.get(this.$route, ['params'])
      if (routeName != 'tableStatistics' || server !== name || db !== oldDB || table !== oldTable) {
        this.getTabelStats({ serverName: name, database: db, table }).then(() =>
          this.$router.push({ name: 'tableStatistics', params: { server: name, db, table } }),
        )
      }
    },
    menuRemoveAllDoc(db, table) {
      // console.debug('menuRemoveAllDoc', { db, table })
      this.showConfirm({
        title: this.$t('delete_all_doc.title'),
        message: _.template(this.$t('delete_all_doc.message'))({ table }),
        defaultCancel: true,
        okLabel: this.$t('delete_all_doc.ok'),
        cancelLabel: this.$t('delete_all_doc.cancel'),
      }).onOk(() => {
        const { server } = _.get(this.$route, ['params'])
        this.deleteData({ serverName: server, database: db, table, id: -1 }).then(() => {
          this.$q.notify({
            type: 'positive',
            message: _.template(this.$t('delete_all_doc.success'))({ table }),
          })
        })
      })
    },
    menuInsertDoc(db, table) {
      // console.debug('menuInsertDoc', table)
      this.openEdit = true
      this.editing = {}
      this.editingTable = table
    },
    editSave(_id, data, table) {
      const { server, db } = _.get(this.$route, ['params'])
      console.debug('editSave', { _id, data, server, db, table })
      this.insertData({ serverName: server, database: db, table, data }).then(() => {
        this.$q.notify({
          type: 'positive',
          message: this.$t('document_insert_success'),
        })
        // const alertOption = {
        //   title: 'Correct',
        //   type: 'positive',
        //   autoClose: 1.5,
        //   message: this.$t('document_insert_success'),
        // }
        // this.showAlert(alertOption).onDismiss(() => this.loadData(this.currentPage))
      })
    },
  },
}
</script>
