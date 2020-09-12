<template lang="pug">
div
  q-list(v-for='row in rows', :key='row.key')
    q-item(v-if='!row.ext', dense, clickable)
      q-item-section.col-4
        .row
          div(:style='`padding-right: ${(level + 1) * 1.4}em;`')
          q-icon(:name='`img:statics/types/${row.value.icon}.png`', style='font-size: 1.4em;')
          | {{ row.key }}
      q-item-section {{ row.value.display() }}
      q-item-section.col-2 {{ row.value.type }}
      q-menu(touch-position, context-menu)
        q-list(dense, style='min-width: 100px')
          q-item(clickable, v-close-popup, v-clipboard:copy='row.key')
            q-item-section {{ $t("menu.copyName") }}
          q-item(clickable, v-close-popup, @click='() => copyValueClick(row.value)')
            q-item-section {{ $t("menu.copyValue") }}
          q-item(clickable, v-close-popup, @click='() => emitCopyPathClick(row)')
            q-item-section {{ $t("menu.copyPath") }}
          q-item(clickable, v-close-popup, @click='() => emitCopyObjectClick(row)')
            q-item-section {{ $t("menu.copyObject") }}
    q-expansion-item(v-if='row.ext', v-model='expandeds[row.key]', expand-icon-class='hide_icon', dense)
      template(v-slot:header)
        q-item-section.col-4
          .row
            div(:style='`padding-right: ${level * 1.4}em;`')
            q-icon(:name='getExpIcon(expandeds[row.key])', style='font-size: 1.4em;')
            q-icon(:name='`img:statics/types/${row.value.icon}.png`', style='font-size: 1.4em;')
            | {{ row.key }}
        q-item-section {{ row.value.display() }}
        q-item-section.col-2 {{ row.value.type }}
        q-menu(touch-position, context-menu)
          q-list(dense, style='min-width: 100px')
            q-item(clickable, v-close-popup, @click='expandedItem(row.key)')
              q-item-section {{ $t("menu.expandedItem") }}
            q-item(clickable, v-close-popup, @click='collapsedItem(row.key)')
              q-item-section {{ $t("menu.collapsedItem") }}
            q-separator 
            q-item(clickable, v-close-popup, v-clipboard:copy='row.key')
              q-item-section {{ $t("menu.copyName") }}
            q-item(clickable, v-close-popup, @click='() => copyJsonClick(row.value)')
              q-item-section {{ $t("menu.copyValueJson") }}
            q-item(clickable, v-close-popup, @click='() => emitCopyPathClick(row)')
              q-item-section {{ $t("menu.copyPath") }}
            q-item(clickable, v-close-popup, @click='() => emitCopyObjectClick(row)')
              q-item-section {{ $t("menu.copyObject") }}
      display-list(
        v-if='expandeds[row.key]',
        :data='row.value.value',
        :level='nextLevel',
        :expandLevel='expandLevels[row.key] || 0',
        @copyPathClick='(childKeys) => copyPathClickHandling(row, childKeys)',
        @copyObjectClick='(childKeys, value) => copyObjectClickHandling(row, childKeys, value)'
      )
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import eJson from 'mongodb-extjson'
import tools from '../util/tools'
export default {
  name: 'displayList',
  props: {
    data: [Object, Array],
    level: Number,
    expandLevel: Number,
  },
  data() {
    return {
      expandeds: {},
      expandLevels: {},
    }
  },
  mounted() {
    if (this.expandLevel === 0) {
      this.expandeds = {}
      this.expandLevels = {}
    } else {
      this.expandeds = this.rows.reduce((pre, curRow) => {
        if (curRow.ext) {
          return _.merge(pre, { [curRow.key]: true })
        } else {
          return pre
        }
      }, {})
      this.expandLevels = this.rows.reduce((pre, curRow) => {
        if (curRow.ext) {
          return _.merge(pre, { [curRow.key]: this.expandLevel - 1 })
        } else {
          return pre
        }
      }, {})
    }
    // console.debug('displayList mounted', {
    //   expandeds: this.expandeds,
    //   expandLevel: this.expandLevel,
    //   expandLevels: this.expandLevels,
    // })
    // this.expandeds = {}
    // Object.keys(this.data).reduce((pre, cur) => {
    //   return _.merge(pre, { [cur]: false })
    // }, {})
  },
  computed: {
    // subExpandLevel() {
    //   if (this.expandLevel !== 0) {
    //     return this.expandLevel - 1
    //   } else {
    //     return 0
    //   }
    // },
    nextLevel() {
      return this.level + 1
    },
    rows() {
      const data = this.data
      if (_.isArray(data)) {
        const r = data.map((value, index) => {
          return {
            key: index,
            value,
            ext: value && value.isExt,
          }
        })
        return r
      } else {
        const r = Object.keys(data).map(key => {
          const value = _.get(data, [key])
          return {
            key,
            value,
            ext: value && value.isExt,
          }
        })
        return r
      }
    },
  },
  methods: {
    expandedItem(rowKey) {
      console.debug('expandedItem', { rowKey })
      Vue.set(this.expandLevels, rowKey, this.expandLevel - 1)
      Vue.set(this.expandeds, rowKey, true)
      // this.expandeds=_.merge(this.expandeds)
    },
    collapsedItem(rowKey) {
      console.debug('collapsedItem', { rowKey })
      Vue.set(this.expandLevels, rowKey, 0)
      Vue.set(this.expandeds, rowKey, false)
      // this.expandeds=_.merge(this.expandeds)
    },
    getExpIcon(v) {
      return v ? 'keyboard_arrow_down' : 'keyboard_arrow_right'
    },
    copyValueClick(value) {
      // console.debug('copyValueClick', { value: value._v })
      this.$copyText(value._v)
    },
    copyJsonClick(value) {
      // console.debug('copyJsonClick', { value: value._v })
      this.$copyText(eJson.stringify(value._v))
    },
    emitCopyPathClick(row) {
      // console.debug('emitCopyPathClick', { row })
      this.$emit('copyPathClick', [row.key])
    },
    emitCopyObjectClick(row) {
      // console.debug('emitCopyObjectClick', { row })
      this.$emit('copyObjectClick', [row.key], row.value._v)
    },
    copyPathClickHandling(row, childKeys) {
      // console.debug('copyPathClickHandling', { row, childKeys })
      if (row.value.type === 'Array') {
        childKeys.splice(0, 1)
      }
      this.$emit('copyPathClick', [row.key, ...childKeys])
      // this.$copyText(JSON.stringify(value._v))
    },
    copyObjectClickHandling(row, childKeys, value) {
      // console.debug('copyObjectClickHandling', { row })
      if (row.value.type === 'Array') {
        childKeys.splice(0, 1)
      }
      this.$emit('copyObjectClick', [row.key, ...childKeys], value)
    },
  },
  watch: {
    expandLevel: {
      handler(val) {
        if (val === 0) {
          this.expandeds = {}
          this.expandLevels = {}
        } else {
          this.expandeds = this.rows.reduce((pre, curRow) => {
            if (curRow.isExt) {
              return _.merge(pre, { [curRow.key]: true })
            } else {
              return pre
            }
          }, {})
          this.expandLevels = this.rows.reduce((pre, curRow) => {
            if (curRow.ext) {
              return _.merge(pre, { [curRow.key]: this.expandLevel - 1 })
            } else {
              return pre
            }
          }, {})
        }
      },
    },
  },
}
</script>
