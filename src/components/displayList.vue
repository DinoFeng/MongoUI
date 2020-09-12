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
            q-item(clickable, v-close-popup, @click='$emit("test")')
              q-item-section 展开(Not yet)
            q-item(clickable, v-close-popup, @click='$emit("test")')
              q-item-section 折叠(Not yet)
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
        @copyPathClick='(childKeys) => copyPathClickHandling(row, childKeys)',
        @copyObjectClick='(childKeys, value) => copyObjectClickHandling(row, childKeys, value)'
      )
</template>

<script>
import _ from 'lodash'
import eJson from 'mongodb-extjson'
import tools from '../util/tools'
export default {
  name: 'displayList',
  props: {
    data: [Object, Array],
    level: Number,
  },
  data() {
    return {
      expandeds: {},
    }
  },
  mounted() {
    this.expandeds = {}
    // Object.keys(this.data).reduce((pre, cur) => {
    //   return _.merge(pre, { [cur]: false })
    // }, {})
  },
  computed: {
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
      console.debug('emitCopyPathClick', { row })
      this.$emit('copyPathClick', [row.key])
    },
    emitCopyObjectClick(row) {
      console.debug('emitCopyObjectClick', { row })
      this.$emit('copyObjectClick', [row.key], row.value._v)
    },
    copyPathClickHandling(row, childKeys) {
      console.debug('copyPathClickHandling', { row, childKeys })
      if (row.value.type === 'Array') {
        childKeys.splice(0, 1)
      }
      this.$emit('copyPathClick', [row.key, ...childKeys])
      // this.$copyText(JSON.stringify(value._v))
    },
    copyObjectClickHandling(row, childKeys, value) {
      console.debug('copyObjectClickHandling', { row })
      if (row.value.type === 'Array') {
        childKeys.splice(0, 1)
      }
      this.$emit('copyObjectClick', [row.key, ...childKeys], value)
    },
  },
}
</script>
