<template lang="pug">
  q-list(bordered)
    q-list(bordered)
      q-item(ref='header' bordered)
        q-item-section {{$t('key')}}
        q-separator(vertical)
        q-item-section &emsp;{{$t('value')}}
        q-separator(vertical)
        q-item-section &emsp;{{$t('type')}}
        //- q-item-section &ensp;{{$t('type')}} & nbsp; & ensp; & emsp;
    q-scroll-area(:style='`height:${bodyHeight}px`')
      q-list(bordered separator)
        q-expansion-item(
          v-for='(row,index) in dataRows'
          v-model='expandeds[rowKey(row)]'
          :key='rowKey(row)'
          :content-inset-level='0.3'
          switch-toggle-side
          )
          template(v-slot:header)
            q-item-section ({{index+1}}) {{hasId(row)?row.value._id.display():""}}
            q-item-section {{row.display()}}
            q-item-section {{row.type}} 
            q-menu(
              touch-position
              context-menu
              )
              q-list(dense style="min-width: 100px")
                q-item(
                  v-if='hasId(row)'
                  clickable 
                  v-close-popup
                  @click='$emit("updateItemClick",getIdValue(row),row._v)'
                  )
                  q-item-section {{$t('menu.updateDocument')}}
                q-item(
                  v-if='hasId(row)'
                  clickable 
                  v-close-popup
                  @click='$emit("removeItemClick",getIdValue(row))'
                  )
                  q-item-section {{$t('menu.removeDocument')}}
                q-separator  
                q-item(
                  clickable 
                  v-close-popup
                  @click='$emit("refreshItemClick")'
                  )
                  q-item-section {{$t('menu.refresh')}}
          display-list(
            v-if='expandeds[rowKey(row)]'
            :data='row.value'
            )
</template>

<script>
import _ from 'lodash'
import displayList from './displayList'
import tools from '../util/tools'
export default {
  name: 'listView',
  components: { displayList },
  props: {
    contentHeight: Number,
    dataRows: Array,
  },
  data() {
    return {
      bodyHeight: 0,
      expandeds: {},
    }
  },
  mounted() {
    this.bodyHeight = this.calcBodyHeight(this.contentHeight)
    this.expandeds = {}
    // this.dataRows.reduce((pre, cur) => {
    //   return _.merge(pre, { [this.rowKey(cur)]: false })
    // }, {})
  },
  computed: {},
  methods: {
    getIdValue(row) {
      return _.get(row, ['value', '_id', '_v'])
    },
    hasId(row) {
      return _.has(row, ['value', '_id'])
    },
    rowKey(row) {
      const key = _.get(row, ['value', '_id'])
      if (key) {
        return ['Object', 'Array'].includes(key.type) ? JSON.stringify(key._v) : key.display()
      } else {
        return JSON.stringify(row._v)
      }
    },
    calcBodyHeight(contentHeight) {
      if (this.$refs.header) {
        const headerSize = tools.getEleSizeValue(this.$refs.header.$el)
        return contentHeight - headerSize.height
      } else {
        return contentHeight
      }
    },
    // getDesc(data) {
    //   return tools.convertSchema(this.schema).displayValue(data)
    // },
    // getType(data) {
    //   return tools.getType(data)
    // },
  },
  watch: {
    contentHeight: {
      handler(val) {
        this.bodyHeight = this.calcBodyHeight(val)
      },
    },
  },
}
</script>
