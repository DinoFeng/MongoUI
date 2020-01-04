<template lang="pug">
  q-layout(view='hHh lPr fFf')
    q-drawer(
      v-model='leftDrawerOpen'
      show-if-above
      bordered
      content-class='bg-grey-2'
      )
      q-scroll-area.fit
        q-list
          q-expansion-item(
            default-opened
            expand-icon-toggle
            expand-separator
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
                  q-icon(name='far fa-hdd')
                q-item-section
                  q-item-label {{server.name}}
                  q-item-label(caption)
                q-item-section(top side)
                  .text-grey-8.q-gutter-xs
                    q-btn.gt-xs(size='10px' flat dense round icon='fas fa-hands-helping')
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
            default-opened
            expand-icon-toggle
            expand-separator
            :content-inset-level='0.3'
            )
            template(v-slot:header)
              q-item-section(avatar)
                q-icon(name='fas fa-hdd')
              q-item-section
                q-item-label {{selectedServer.name}}
                q-item-label(caption)
            q-list                    
              q-item(clickable)
                q-item-section(avatar)
                  q-icon(name='fas fa-database')
                q-item-section
                  q-item-label Servers
                  q-item-label(caption)
    q-page-container
      router-view
</template>

<script>
// import _ from 'lodash'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'PageIndex',
  data() {
    return {}
  },
  mounted() {
    this.loadServerConfig()
    if (this.serverList.length > 0) {
      this.setShowServerConfigDialog(false)
    } else {
      this.setShowServerConfigDialog(true)
    }
  },
  computed: {
    ...mapState('master', ['leftDrawerOpen']),
    ...mapGetters('master', ['serverList', 'selectedServer']),
  },
  methods: {
    ...mapMutations('master', [
      'setShowServerConfigDialog',
      'loadServerConfig',
      'deleteServerConfig',
      'setEditingConfig',
    ]),
    showServerConfigDialog(create, editData) {
      if (editData) {
        const { name, connection, options } = editData
        if (create) {
          this.setEditingConfig({ connection, options })
        } else {
          this.setEditingConfig({ name, connection, options })
        }
      } else {
        this.setEditingConfig(null)
      }
      this.setShowServerConfigDialog(true)
    },
  },
}
</script>
