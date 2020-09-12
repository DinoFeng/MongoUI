<template lang="pug">
  q-list
    q-expansion-item(
      v-for='db in databases'
      v-model='dbSelected[db.name]'
      :key='db.name'
      :content-inset-level='0.3'
      expand-icon-toggle
      expand-separator
      group='dbGroup'
      )
      template(v-slot:header)
        q-item-section(avatar)
          q-icon(name='fas fa-database')
        q-item-section.cursor-pointer(@click='onItemClick(db.name)')
          q-item-label
            | {{db.name}}
        q-menu(
          touch-position
          context-menu
          )
          q-list(dense style="min-width: 100px")
            q-item(
              clickable 
              v-close-popup
              @click='$emit("menuDatabaseRefresh",db.name)'
              )
              q-item-section {{$t('menu.refresh')}}
            q-separator
            q-item(
              clickable 
              v-close-popup
              @click='$emit("menuCreateCollection",db.name)'
              )
              q-item-section {{$t('menu.createCollection')}}
            q-separator
            q-item(
              clickable 
              v-close-popup
              @click='$emit("menuDropDatabase",db.name)'
              )
              q-item-section {{$t('menu.dropDatabase')}}
            q-separator
            q-item(
              clickable 
              v-close-popup
              @click='$emit("menuDatabaseStatistics",db.name)'
              )
              q-item-section {{$t('menu.databaseStatistics')}}
      table-items(
        :tables='db.tables'
        @tableClick='table=>$emit("tableClick",db.name,table)'
        @menuInsertDoc='table=>$emit("menuInsertDoc",db.name,table)'
        @menuRemoveAllDoc='table=>$emit("menuRemoveAllDoc",db.name,table)'
        @menuRenameCollection='table=>$emit("menuRenameCollection",db.name,table)'
        @menuDuplicateCollection='table=>$emit("menuDuplicateCollection",db.name,table)'
        @menuDropCollection='table=>$emit("menuDropCollection",db.name,table)'
        @menuStatistics='table=>$emit("menuCollectionStatistics",db.name,table)'
        )
    
</template>
<script>
import _ from 'lodash'
// import vue from 'vue'
import tableItems from './tableItemsForDrawer'
export default {
  name: 'databaseItemsForDrawer',
  components: {
    tableItems,
  },
  props: {
    databases: Array,
  },
  data() {
    return {
      dbSelected: {},
    }
  },
  mounted() {
    const { db } = _.get(this.$route, ['params'])
    if (db) {
      this.dbSelected = { [db]: !this.dbSelected[db] }
    } else {
      this.dbSelected = {}
    }
  },
  methods: {
    onItemClick(database) {
      // console.debug('onItemClick', database)
      // this.dbSelected[database] = !this.dbSelected[database]
      this.dbSelected = { [database]: !this.dbSelected[database] }
      this.$emit('databaseClick', database)
    },
  },
}
</script>
<style lang="stylus" scoped>
.q-expansion-item--expanded>div>.q-item>.q-item__section {
  color: #1976d2;
  font-weight: 700;
}
</style>
