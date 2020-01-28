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
            q-item(clickable v-close-popup)
              q-item-section Update Documents
            q-item(clickable v-close-popup)
              q-item-section Remove Documents          
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
      const row = _.get(this.dataRows, [0]) || {}
      return Object.keys(row).map(name => ({
        name,
        label: name, //_.startCase(name),
        align: 'left',
        field: row => {
          const type = tools.getType(row[name])
          if (['Object', 'Array'].includes(type)) {
            return type
          } else {
            return row[name]
          }
        },
      }))
    },
  },
}
</script>
