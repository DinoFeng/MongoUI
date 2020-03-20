<template lang="pug">
  q-list
    q-expansion-item(
      v-for='db in databases'
      :key='db.name'
      expand-icon-toggle
      expand-separator
      group="dbGroup"
      :content-inset-level='0.3'
      )
      template(v-slot:header)
        q-item-section(avatar)
          q-icon(name='fas fa-database')
        q-item-section.cursor-pointer(@click='$emit("dbClick",db.name)')
          q-item-label
            | {{db.name}}
        q-menu(
          touch-position
          context-menu
          )
          q-list(dense style="min-width: 100px")
            q-item(clickable v-close-popup)
              q-item-section {{$t('menu.refresh')}}
            q-separator
            q-item(clickable v-close-popup)
              q-item-section {{$t('menu.databaseStatistics')}}
            q-separator
            q-item(clickable v-close-popup)
              q-item-section {{$t('menu.dropDatabase')}}
      table-items(
        :tables='db.tables'
        @tableClick='table=>$emit("tableClick",db.name,table)'
        @menuInsertDoc='table=>$emit("menuInsertDoc",db.name,table)'
        @menuRemoveAllDoc='table=>$emit("menuRemoveAllDoc",db.name,table)'
        @menuStatistics='table=>$emit("menuStatistics",db.name,table)'
        )
    
</template>
<script>
import tableItems from './tableItemsForDrawer'
export default {
  name: 'databaseItemsForDrawer',
  components: {
    tableItems,
  },
  props: {
    databases: Array,
  },
}
</script>
