<template lang="pug">
//- q-input(
//-   ref='content'
//-   :value='datas'
//-   :rows='maxRows'
//-   :style='`height:${contentHeight}px`'
//-   type='textarea'
//-   filled
//-   outlined
//-   standout 
//-   readonly
//-   )
div
  ace-editor(
    v-model='datas'
    mode='javascript'
    theme='kuroir'
    readonly
    :maxLines='maxRows'
    :minLines='maxRows'
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
import eJson from 'mongodb-extjson'
import aceEditor from './ace-editor'
import { dom } from 'quasar'
export default {
  name: 'documentView',
  components: { aceEditor },
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
    // console.debug(this.maxRows, this.contentHeight)
  },
  computed: {
    datas: {
      get() {
        const r = this.dataRows
          .map((row, index) => `/* ${index} */\r\n${eJson.stringify(row._v, null, 4, { relaxed: true })}`)
          .join('\r\n\r\n')
        // console.debug('r')
        return r
      },
      set() {},
    },
  },
  methods: {
    getLineHeight() {
      return 16
      // if (this.$refs.content) {
      //   const { style } = dom
      //   return _.toNumber(_.trimEnd(style(this.$refs.content.$el, 'line-height'), 'px'))
      // } else {
      //   return 10
      // }
    },
    calcMaxRows(contentHeight) {
      const x = this.getLineHeight()
      return Math.ceil(contentHeight / x)
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
