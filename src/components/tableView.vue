<template lang="pug">
  sticky-header-table(
    :data='rows'
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
          ) 
          q-icon(:name='`img:statics/types/${props.row[col.name] && props.row[col.name].icon}.png`' style='font-size: 1.4em;')
          span {{ col.value }}
        q-menu(
          touch-position
          context-menu
          )
          q-list(dense style="min-width: 100px")
            q-item(
              v-if='hasId(props.row)'
              clickable 
              v-close-popup
              @click='$emit("updateItemClick",getIdValue(props.row),getOrgData(getIdValue(props.row)))'
              )
              q-item-section {{$t('menu.updateDocument')}}
            q-item(
              v-if='hasId(props.row)'
              clickable 
              v-close-popup
              @click='$emit("removeItemClick",getIdValue(props.row))'
              )
              q-item-section {{$t('menu.removeDocument')}}
            q-separator  
            q-item(
              v-if='!hideFreshMenu'
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
    hideFreshMenu: Boolean,
  },
  data() {
    return {
      maxRows: 10,
    }
  },
  computed: {
    ...mapGetters('master', ['pagination']),
    rows() {
      return this.dataRows.map(row => row.value)
    },
    columns() {
      const mergeRow = this.rows.reduce((pre, cur) => {
        return _.merge(pre, cur)
      }, {})
      // console.debug(this.dataRows, row)
      return Object.keys(mergeRow).map(name => ({
        name,
        label: name, //_.startCase(name),
        align: 'left',
        field: row => {
          if (!_.isUndefined(row[name])) {
            return row[name].display()
          } else {
            return undefined
          }
        },
      }))
    },
  },
  methods: {
    hasId(row) {
      // console.debug({ row })
      return _.has(row, ['_id'])
    },
    getIdValue(row) {
      return _.get(row, ['_id', '_v'])
    },
    getOrgData(idValue) {
      const data = this.dataRows.find(row => this.getIdValue(row.value) === idValue)
      // console.debug(data)
      return data && data._v
    },
  },
}
</script>
