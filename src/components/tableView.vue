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
