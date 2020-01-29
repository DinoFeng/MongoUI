<template lang="pug">
      q-card
        q-card-section {{$t('databaseStatistics')}}
        q-card-section
          q-list
            q-expansion-item(
              v-for='db in databasesInfo'
              v-if='!!db'
              :key='db.name'
              popup 
              icon='fas fa-database'
              :label='db.name'
              :content-inset-level='0.3'
              )
              q-list
                q-item(
                  v-for='table in db.tables'
                  :key='table.name'
                  )
                  q-item-section(avatar)
                    q-icon(name='fas fa-table')
                  q-item-section
                    q-item-label {{table.name}}
                  q-item-section(avatar style='padding-right:32px;')
                    q-icon(name='fas fa-hdd')
                  q-item-section
                    q-item-label(v-if='table.size<1000') {{$t('storage')}} {{table.size}} Bytes
                    q-item-label(v-else-if='table.size<1000*1000') {{$t('storage')}} {{Math.round(table.size/10)/100}} KB
                    q-item-label(v-else) {{$t('storage')}} {{Math.round(table.size/1000/10)/100}} MB
                  q-item-section(avatar style='padding-right:32px')
                    q-icon(name='fas fa-file')
                  q-item-section
                    q-item-label {{$t('documents')}} {{table.count}}

</template>
<script>
export default {
  name: 'databaseInfo',
  props: {
    databasesInfo: Array,
  },
}
</script>
