<template lang="pug">
q-list(bordered)
  q-list(bordered)
    q-item(ref='header', bordered)
      q-item-section.col-4 {{ $t("key") }}
      q-separator(vertical)
      q-item-section &emsp;{{ $t("value") }}
      q-separator(vertical)
      q-item-section.col-2 &emsp;{{ $t("type") }}
      //- q-item-section &ensp;{{$t('type')}} & nbsp; & ensp; & emsp;
  q-scroll-area(:style='`height:${bodyHeight}px`')
    q-list(bordered, separator)
      q-expansion-item(
        v-for='(row, index) in dataRows',
        v-model='expandeds[rowKey(row)]',
        :key='rowKey(row)',
        expand-icon-class='hide_icon',
        dense
      )
        template(v-slot:header)
          q-item-section.col-4
            .row
              q-icon(:name='getExpIcon(expandeds[rowKey(row)])', style='font-size: 1.4em;')
              q-icon(:name='`img:statics/types/${row.icon}.png`', style='font-size: 1.4em;')
              | ({{ index + 1 }}) {{ hasId(row) ? row.value._id.display() : "" }}
          q-item-section {{ row.display() }}
          q-item-section.col-2 {{ row.type }}
          q-menu(touch-position, context-menu)
            q-list(dense, style='min-width: 100px')
              q-item(clickable, v-close-popup, @click='expandedItem(rowKey(row))')
                q-item-section {{ $t("menu.expandedItem") }}
              q-item(clickable, v-close-popup, @click='collapsedItem(rowKey(row))')
                q-item-section {{ $t("menu.collapsedItem") }}
              q-separator 
              q-item(clickable, v-close-popup, @click='$emit("insertItemClick")')
                q-item-section {{ $t("menu.insertDocument") }}
              q-item(
                v-if='hasId(row)',
                clickable,
                v-close-popup,
                @click='$emit("browsItemClick", getIdValue(row), row._v)'
              )
                q-item-section {{ $t("menu.browseDocument") }}
              q-item(
                v-if='hasId(row)',
                clickable,
                v-close-popup,
                @click='$emit("updateItemClick", getIdValue(row), row._v)'
              )
                q-item-section {{ $t("menu.updateDocument") }}
              q-item(v-if='hasId(row)', clickable, v-close-popup, @click='$emit("removeItemClick", getIdValue(row))')
                q-item-section {{ $t("menu.removeDocument") }}
              q-separator 
              q-item(v-if='hasId(row)', clickable, v-close-popup, @click='() => copyDocJsonClickHandling(row)')
                q-item-section {{ $t("menu.copyDocJson") }}
              q-separator 
              q-item(v-if='!hideFreshMenu', clickable, v-close-popup, @click='$emit("refreshItemClick")')
                q-item-section {{ $t("menu.refresh") }}
        display-list(
          v-if='expandeds[rowKey(row)]',
          :data='row.value',
          :level='1',
          :expandLevel='expandLevels[rowKey(row)] || 0',
          @copyPathClick='copyPathClickHandling',
          @copyObjectClick='copyObjectClickHandling'
        )
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import eJson from 'mongodb-extjson'
import displayList from './displayList'
import tools from '../util/tools'
export default {
  name: 'listView',
  components: { displayList },
  props: {
    contentHeight: Number,
    dataRows: Array,
    hideFreshMenu: Boolean,
  },
  data() {
    return {
      bodyHeight: 0,
      expandeds: {},
      expandLevels: {},
    }
  },
  mounted() {
    this.bodyHeight = this.calcBodyHeight(this.contentHeight)
    this.expandeds = {}
    this.expandLevels = {}
    // this.dataRows.reduce((pre, cur) => {
    //   return _.merge(pre, { [this.rowKey(cur)]: false })
    // }, {})
  },
  computed: {},
  methods: {
    getExpIcon(v) {
      return v ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
    },
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
    expandedItem(rowKey) {
      console.debug('expandedItem', { rowKey })
      Vue.set(this.expandLevels, rowKey, -1)
      Vue.set(this.expandeds, rowKey, true)
      // this.expandLevel = -1
    },
    collapsedItem(rowKey) {
      console.debug('collapsedItem', { rowKey })
      Vue.set(this.expandLevels, rowKey, 0)
      Vue.set(this.expandeds, rowKey, false)
      // this.expandLevel = 0
    },
    copyPathClickHandling(path) {
      // console.debug('copyPathClickHandling', { path })
      // this.$emit('copyPathClick', `${key}.${childKey}`)
      this.$copyText(path.join('.'))
    },
    copyObjectClickHandling(path, value) {
      // console.debug('copyObjectClickHandling', { path, value })
      // this.$emit('copyPathClick', `${key}.${childKey}`)
      this.$copyText(JSON.stringify({ [`${path.join('.')}`]: value }))
    },
    copyDocJsonClickHandling(row) {
      // console.debug('copyDocJsonClickHandling', { v: row._v })
      this.$copyText(eJson.stringify(row._v))
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
<style lang="stylus" scoped>
>>>.hide_icon {
  display: none !important;
}

>>>.q-item--dense {
  padding: 2px 2px;
}
</style>
