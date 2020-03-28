<template lang="pug">
      q-card
        q-card-section {{$t('databaseStatistics')}}
        q-card-section
          q-list
            q-expansion-item(
              v-for='(db, index) in databasesInfo'
              v-if='!!db'
              :key='db.name'
              :label='db.name'
              :content-inset-level='0.3'
              :default-opened='index===0'
              icon='fas fa-database'
              group='dbInfo'
              popup 
              )
              q-list
                q-item(
                  v-for='table in db.tables'
                  :key='table.name'
                  )
                  q-item-section(avatar)
                    q-icon(name='fas fa-table')
                  q-item-section
                    q-item-label 
                      a(:href='`/app/${server}/${db.name}/${table.name}`') {{table.name}}
                      //- a(href='javascript:void(0)' @click='$emit("tableClick",db.name,table.name)') {{table.name}}
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
import _ from 'lodash'
export default {
  name: 'databaseInfo',
  props: {
    databasesInfo: Array,
  },
  computed: {
    server() {
      const { server } = _.get(this.$route, ['params'])
      return server
    },
  },
}
</script>
<style lang="stylus" scoped>
>>>a:link {
  text-decoration: none;
  color: blue;
}

>>>a:active {
  text-decoration: blink;
}

>>>a:hover {
  text-decoration: none;
  color: red;
}

>>>a:visited {
  text-decoration: none;
  color: green;
}
</style>
