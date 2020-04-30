<template lang="pug">
  sticky-header-table(
    :data='dataRows'
    :columns='columns'
    :pagination='pagination'
    :tableHeight='contentHeight'
    :table-header-style="{ backgroundColor: '#eee' }"
    row-key='_id'
    hide-bottom
    )
    template(v-slot:body='props')
      q-tr(:props='props')
        q-td(
          v-for='col in props.cols'
          :key='col.name'
          :props="props"
          ) {{ col.value }}
        q-menu(
          touch-position
          context-menu
          )
          q-list(dense style="min-width: 100px")
            q-item(
              v-if='!!props.row._id'
              clickable 
              v-close-popup
              @click='$emit("updateItemClick",props.row._id,props.row)'
              )
              q-item-section {{$t('menu.updateDocument')}}
            q-item(
              v-if='!!props.row._id'
              clickable 
              v-close-popup
              @click='$emit("removeItemClick",props.row._id)'
              )
              q-item-section {{$t('menu.removeDocument')}}
            q-separator  
            q-item(
              clickable 
              v-close-popup
              @click='$emit("refreshItemClick")'
              )
              q-item-section {{$t('menu.refresh')}}
</template>

<script>
import _ from 'lodash'
import tools from '../util/tools'
import { mapGetters } from 'vuex'
import stickyHeaderTable from './stickyHeaderTable'
export default {
  name: 'tableView',
  components: { stickyHeaderTable },
  props: {
    contentHeight: Number,
    dataRows: Array,
    schema: [Object, Array],
  },
  data() {
    return {
      maxRows: 10,
    }
  },
  computed: {
    ...mapGetters('master', ['pagination']),
    columns() {
      // return this.resultColumns
      const row = this.dataRows.reduce((pre, cur) => {
        return _.merge(pre, cur)
      }, {}) //  _.get(this.dataRows, [0]) || {}
      return Object.keys(row).map(name => ({
        name,
        label: name, //_.startCase(name),
        align: 'left',
        field: row => {
          if (!_.isUndefined(row[name])) {
            const type = tools.getTypeFromDocSchema(this.schema, name, row[name])
            // if (['Document', 'Array'].includes(type.typeDesc)) {
            //   return type.typeDesc
            // } else {
            return type.displayValue(row[name]) // row[name]
            // }
          } else {
            row[name]
          }
        },
      }))
    },
  },
}
</script>
