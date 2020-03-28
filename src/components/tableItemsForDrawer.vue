<template lang="pug">
  q-list
    q-item(
      v-for='table in tables'
      :key='table.name'
      :active='active[table.name]'
      clickable
      )
      q-item-section(avatar)
        q-icon(name='fas fa-table')
      q-item-section.cursor-pointer(@click='onItemClick(table.name)')
        q-item-label {{table.name}}
        q-item-label(caption)
      q-menu(
        touch-position
        context-menu
        )
        q-list(dense style="min-width: 100px")
          //- q-item(clickable v-close-popup)
          //-   q-item-section View Documents
          //- q-separator
          q-item(
            clickable 
            v-close-popup
            @click='$emit("menuInsertDoc",table.name)'
            )
            q-item-section {{$t('menu.insertDocument')}}
          //- q-item(clickable v-close-popup)
          //-   q-item-section Update Documents
          //- q-item(clickable v-close-popup)
          //-   q-item-section Remove Documents
          q-item(
            clickable 
            v-close-popup
            @click='$emit("menuRemoveAllDoc",table.name)'
            )
            q-item-section {{$t('menu.removeAllDocuments')}}
          q-separator
          q-item(
            clickable 
            v-close-popup
            @click='$emit("menuRenameCollection",table.name)'
            )
            q-item-section {{$t('menu.renameCollection')}}
          q-item(
            clickable 
            v-close-popup
            @click='$emit("menuDuplicateCollection",table.name)'
            )
            q-item-section {{$t('menu.duplicateCollection')}}
          q-item(
            clickable 
            v-close-popup
            @click='$emit("menuDropCollection",table.name)'
            )
            q-item-section {{$t('menu.dropCollection')}}
          q-separator
          q-item(
            clickable 
            v-close-popup
            @click='$emit("menuStatistics",table.name)'
            )
            q-item-section {{$t('menu.statistics')}}
</template>

<script>
import _ from 'lodash'
export default {
  name: 'tableItemsForDrawer',
  props: {
    tables: Array,
  },
  data() {
    return {
      active: {},
    }
  },
  mounted() {
    // console.debug('mounted')
    const { table } = _.get(this.$route, ['params'])
    if (table) {
      this.active = { [table]: true }
    } else {
      this.active = {}
    }
  },
  methods: {
    onItemClick(tableName) {
      // this.active[tableName] = true
      this.active = { [tableName]: !this.active[tableName] }
      this.$emit('tableClick', tableName)
    },
  },
}
</script>
<style lang="stylus" scoped>
.q-item {
  border-radius: 10px 0 0 10px;
}

.q-item--active {
  background: #e6f1fc;
}
</style>
