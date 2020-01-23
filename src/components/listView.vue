<template lang="pug">
  q-list(bordered)
    q-list(bordered)
      q-item(ref='header' bordered)
        q-item-section key
        q-separator(vertical)
        q-item-section value
        q-separator(vertical)
        q-item-section type
    q-scroll-area(:style='`height:${bodyHeight}px`')
      q-list(bordered separator)
        q-expansion-item(
          v-for='(row,index) in dataRows'
          v-model='expandeds[row._id]'
          :key='row._id'
          :content-inset-level='0.3'
          switch-toggle-side
          )
          template(v-slot:header)
            q-item-section ({{index+1}}) ObjectId("{{row._id}}") 
            q-item-section {{getDesc(row)}}
            q-item-section {{getType(row)}}
          display-list(
            v-if='expandeds[row._id]'
            :data='row'
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
    this.expandeds = this.dataRows.reduce((pre, cur) => {
      return _.merge(pre, { [cur._id]: false })
    }, {})
  },
  methods: {
    calcBodyHeight(contentHeight) {
      if (this.$refs.header) {
        const headerSize = tools.getEleSizeValue(this.$refs.header.$el)
        return contentHeight - headerSize.height
      } else {
        return contentHeight
      }
    },
    getDesc(data) {
      return tools.getDataDesc(data)
    },
    getType(data) {
      return tools.getType(data)
    },
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
