<template lang="pug">
  q-list
    q-item(
      v-for='table in tables'
      :key='table.name'
      clickable
      )
      q-item-section(avatar)
        q-icon(name='fas fa-table')
      q-item-section.cursor-pointer(@click='$emit("tableClick",table.name)')
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
          q-item(clickable v-close-popup)
            q-item-section {{$t('menu.removeAllDocuments')}}
          q-separator
          q-item(clickable v-close-popup)
            q-item-section {{$t('menu.renameCollection')}}
          q-item(clickable v-close-popup)
            q-item-section {{$t('menu.duplicateCollection')}}
          q-item(clickable v-close-popup)
            q-item-section {{$t('menu.dropCollection')}}
          q-separator
          q-item(clickable v-close-popup)
            q-item-section {{$t('menu.statistics')}}
</template>

<script>
export default {
  name: 'tableItemsForDrawer',
  props: {
    tables: Array,
  },
}
</script>
