<template lang="pug">
  div
    q-list(
      v-for='row in rows' 
      :key='row.key'
      )
      q-item(v-if='!row.ext')
        q-item-section {{row.key}}
        q-item-section {{row.value.display()}}
        q-item-section {{row.value.type}}
      q-expansion-item(
        v-if='row.ext'
        v-model='expandeds[row.key]'
        :content-inset-level='0.3'
        switch-toggle-side
        )
        template(v-slot:header)
          q-item-section {{row.key}}
          q-item-section {{row.value.display()}}
          q-item-section {{row.value.type}}
        display-list(
          v-if='expandeds[row.key]'
          :data='row.value.value'
          )
</template>

<script>
import _ from 'lodash'
import tools from '../util/tools'
export default {
  name: 'displayList',
  props: {
    data: [Object, Array],
    // schema: [Object, Array],
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
  methods: {},
}
</script>
