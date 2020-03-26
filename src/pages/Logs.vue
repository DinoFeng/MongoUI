<template lang="pug">
  q-page(:style-fn='myTweak')
    q-resize-observer(@resize='onResize')
    .q-pa-md(ref='mainContent')
      q-breadcrumbs(ref='header')
        q-breadcrumbs-el(:label='navigation.server' icon='fas fa-desktop' :to='`/app/${navigation.server}`')
        q-breadcrumbs-el(v-if='!!navigation.db' :label='navigation.db' icon='fas fa-database' :to='`/app/${navigation.server}/${navigation.db}`')
        q-breadcrumbs-el(v-if='!!navigation.table' :label='navigation.table' icon='fas fa-table' :to='`/app/${navigation.server}/${navigation.db}/${navigation.table}`')
        q-breadcrumbs-el(label='Logs' icon='list_alt')
      .q-pa-md(ref='bodyContent')
        q-input(
          ref='content'
          :value='datas'
          :rows='maxRows'
          :style='`height:${contentHeight}px;`'
          type='textarea'
          filled
          outlined
          standout 
          readonly
          )
          //- q-menu(
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
import tools from '../util/tools'
import { mapGetters } from 'vuex'
export default {
  name: 'PageLogs',
  components: {},
  data() {
    return {
      contentHeight: 100,
      maxRows: 10,
    }
  },
  mounted() {
    this.maxRows = this.calcMaxRows(this.contentHeight)
  },
  computed: {
    ...mapGetters('master', ['tableRows']),
    navigation() {
      return _.get(this.$route, ['params'])
    },
    datas() {
      const logs = _.get(this.tableRows, [0, 'log'])
      if (logs) {
        return logs.join('\r\n\r\n')
      } else {
        return ''
      }
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
    myTweak(offset) {
      return { height: offset ? `calc(100vh - ${offset}px)` : '100vh', overflow: 'auto' }
    },
    onResize(size) {
      const mainPadding = tools.getPaddingValue(this.$refs.mainContent)
      const bodyPadding = tools.getPaddingValue(this.$refs.bodyContent)
      // console.debug(mainPadding, bodyPadding)
      const headerSize = tools.getEleSizeValue(this.$refs.header.$el)
      // const toolbarSize = tools.getEleSizeValue(this.$refs.toolbar.$el)
      this.contentHeight =
        size.height -
        (headerSize.height +
          // toolbarSize.height +
          mainPadding.top +
          mainPadding.bottom +
          bodyPadding.top +
          bodyPadding.bottom)
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
<style lang="stylus" scoped>
>>>textarea {
  white-space: pre !important;
}
</style>
