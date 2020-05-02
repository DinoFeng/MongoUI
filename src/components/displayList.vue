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
    // console.debug({ data: this.data, schema: this.schema, field: this.field })
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
          // const type = tools.getTypeFromArraySchema(schema, value)
          // const value = _.get(v, ['value'])
          return {
            key: index,
            value,
            ext: value && value.isExt, // this.isExt(value),
          }
        })
        // console.debug(r)
        return r
      } else {
        const r = Object.keys(data).map(key => {
          // const type = tools.getTypeFromDocSchema(schema, key, data[key])
          const value = _.get(data, [key])
          return {
            key,
            value,
            ext: value && value.isExt,
            // type: value && value.type,
            // ext: type.isExt, // this.isExt(data[key]),
          }
        })
        // console.debug(r)
        return r
      }
    },
  },
  methods: {
    // getDesc(data) {
    //   return tools.getDataDesc(data)
    // },
    // getType(s, f, v) {
    //   const type = tools.getTypeFromDocSchema(s, f, v)
    //   // console.debug({ type })
    //   return type
    // },
    // isExt(v) {
    //   const type = tools.getType(v)
    //   return ['Object', 'Array'].includes(type)
    // },
  },
}
</script>
