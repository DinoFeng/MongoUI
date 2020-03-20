<template lang="pug">
  q-input(
    ref='content'
    :value='datas'
    :rows='maxRows'
    :style='`height:${contentHeight}px`'
    type='textarea'
    filled
    outlined
    standout 
    readonly
    )
    q-menu(
      touch-position
      context-menu
      )
      q-list(dense style="min-width: 100px")
        q-item(
          clickable 
          v-close-popup
          @click='$emit("refreshItemClick")'
          )
          q-item-section {{$t('menu.refresh')}}
</template>

<script>
import _ from 'lodash'
import { dom } from 'quasar'
export default {
  name: 'documentView',
  props: {
    contentHeight: Number,
    dataRows: Array,
  },
  data() {
    return {
      maxRows: 10,
    }
  },
  mounted() {
    this.maxRows = this.calcMaxRows(this.contentHeight)
  },
  computed: {
    datas() {
      return this.dataRows.map((row, index) => `/* ${index} */\r\n${JSON.stringify(row, null, 4)}`).join('\r\n\r\n')
    },
  },
  methods: {
    getLineHeight() {
      if (this.$refs.content) {
        const { style } = dom
        return _.toNumber(_.trimEnd(style(this.$refs.content.$el, 'line-height'), 'px'))
      } else {
        return 10
      }
    },
    calcMaxRows(contentHeight) {
      const x = this.getLineHeight()
      return Math.ceil(contentHeight / x) + 6
    },
  },
  watch: {
    contentHeight: {
      handler(val) {
        this.maxRows = this.calcMaxRows(val)
      },
    },
  },
}
</script>
