<template lang="pug">
  main
    q-drawer(
      v-model='leftDrawerOpen'
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
                      @click='()=>gotoServerIndex(server.name)'
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
                  q-item(clickable v-close-popup)
                    q-item-section Refresh
                  q-separator
                  q-item(clickable v-close-popup)
                    q-item-section Create Database
                  q-item(clickable v-close-popup)
                    q-item-section Server Status
                  q-item(clickable v-close-popup)
                    q-item-section Host Info
                  q-item(clickable v-close-popup)
                    q-item-section MongoDB Version
                  q-separator
                  q-item(clickable v-close-popup)
                    q-item-section Show Log
            database-items(
              :databases='selectedDatabases'
              @dbClick='dbClick'
              @tableClick='tableClick'
              )
    q-page-container
      router-view
    server-config-dialog(
      v-model='serverConfigShow'
      :editData='editingConfig'
      )
</template>

<script>
import _ from 'lodash'
import serverConfigDialog from '../components/serverConfigDialog'
import databaseItems from '../components/databaseItemsForDrawer'
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  components: {
    serverConfigDialog,
    databaseItems,
  },
  data() {
    return {
      serverConfigShow: false,
      editingConfig: null,
    }
  },
  mounted() {
    if (this.serverList.length > 0) {
      this.serverConfigShow = false
      const { server, db, table } = _.get(this.$route, ['params'])
      console.debug('index mounted', { server, db, table })
      if (server) {
        this.connectServer(server)
        if (db) {
          if (table) {
            this.$router.push({ name: 'table', params: { server, db, table } })
          }
        }
      } else {
        this.$router.push({ name: 'home' })
      }
    } else {
      this.serverConfigShow = true
    }
  },
  computed: {
    ...mapState('master', ['leftDrawerOpen', 'selectedServer']),
    ...mapGetters('master', ['serverList', 'selectedDatabases']),
    // selectedServerDBs() {
    //   return _.get(this.selectedServer, ['dbStatistics', 'databases']) || []
    // },
  },
  methods: {
    ...mapMutations('master', ['deleteServerConfig', 'setSelectedServer']),
    ...mapActions('master', ['connectServer']),
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
    gotoServerIndex(serverName) {
      this.connectServer(serverName)
      this.$router.push({ name: 'server', params: { server: serverName } })
    },
    dbClick(db) {
      console.debug('dbName', db)
      const { name } = this.selectedServer
      this.$router.push({ name: 'database', params: { server: name, db } })
    },
    tableClick(db, table) {
      console.debug('tableClick', db, table)
      const { name } = this.selectedServer
      this.$router.push({ name: 'table', params: { server: name, db, table } })
      // window.location.href = `app/${name}/${db}/${table}`
    },
  },
}
</script>
