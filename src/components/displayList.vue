<template lang="pug">
  div
    q-list(
      v-for='row in rows' 
      :key='row.key'
      )
      q-item(v-if='!row.ext')
        q-item-section {{row.key}}
        q-item-section {{row.value}}
        q-item-section {{row.type}}
      q-expansion-item(
        v-if='row.ext'
        v-model='expandeds[row.key]'
        :content-inset-level='0.3'
        switch-toggle-side
        )
        template(v-slot:header)
          q-item-section {{row.key}}
          q-item-section {{getDesc(row.value)}}
          q-item-section {{row.type}}
        display-list(
          v-if='expandeds[row.key]'
          :data='row.value'
          )
</template>

<script>
import _ from 'lodash'
import tools from '../util/tools'
export default {
  name: 'displayList',
  props: {
    data: [Object, Array],
  },
  data() {
    return {
      expandeds: {},
    }
  },
  mounted() {
    this.expandeds = Object.keys(this.data).reduce((pre, cur) => {
      return _.merge(pre, { [cur]: false })
    }, {})
  },
  computed: {
    rows() {
      const data = this.data
      if (_.isArray(data)) {
        return data.map((value, index) => ({
          key: index,
          value,
          type: this.getType(value),
          ext: this.isExt(value),
        }))
      } else {
        return Object.keys(data).map(key => ({
          key,
          value: data[key],
          type: this.getType(data[key]),
          ext: this.isExt(data[key]),
        }))
      }
    },
  },
  methods: {
    getDesc(data) {
      return tools.getDataDesc(data)
    },
    getType(v) {
      return tools.getType(v)
    },
    isExt(v) {
      const type = tools.getType(v)
      return ['Object', 'Array'].includes(type)
    },
  },
}
</script>
