<template lang="pug">
div
  q-list(v-for='row in rows', :key='row.key')
    q-item(v-if='!row.ext', dense)
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
            q-item-section copy name
          q-item(clickable, v-close-popup, @click='() => copyValueClick(row.value)')
            q-item-section copy value
          q-item(clickable, v-close-popup, @click='() => emitCopyPathClick(row)')
            q-item-section copy path
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
            q-item(clickable, v-close-popup, v-clipboard:copy='row.key')
              q-item-section copy name
            q-item(clickable, v-close-popup, @click='() => copyJsonClick(row.value)')
              q-item-section copy json
            q-item(clickable, v-close-popup, @click='() => emitCopyPathClick(row)')
              q-item-section copy path
      display-list(
        v-if='expandeds[row.key]',
        :data='row.value.value',
        :level='nextLevel',
        @copyPathClick='(childKey) => copyPathClickHandling(row, childKey)'
      )
</template>

<script>
import _ from 'lodash'
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
      this.$copyText(JSON.stringify(value._v))
    },
    emitCopyPathClick(row) {
      console.debug('copyPathClickHandling', { row })
      this.$emit('copyPathClick', row.key)
    },
    copyPathClickHandling(row, childKey) {
      console.debug('copyPathClickHandling', { row, childKey })
      this.$emit('copyPathClick', `${row.key}.${childKey}`)
      // this.$copyText(JSON.stringify(value._v))
    },
  },
}
</script>
