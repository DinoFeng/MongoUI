<!--<template lang="pug">
</template>
-->
<script>
import _ from 'lodash'
import { QTable } from 'quasar'
export default {
  extends: QTable,
  props: {
    tableHeight: Number,
    heightUnit: String,
  },
  mixins: [],
  data: () => ({}),
  mounted() {
    // this.$el.ownerDocument.documentElement.style.setProperty(
    //   '--tableHeight',
    //   `${this.calcHeight(this.tableHeight)}${this.heightUnit || 'px'}`,
    // )
    const tableBody = this.$el.getElementsByClassName('q-table__middle')
    // console.debug('stickyHeaderTable mounted', tableBody)
    if (tableBody.length > 0) {
      tableBody[0].style.height = 0
      setTimeout(() => {
        tableBody[0].setAttribute('style', `height:${this.calcHeight(this.tableHeight)}${this.heightUnit || 'px'}`)
        const tableTop = this.$el.getElementsByClassName('q-table__top')
        if (tableTop.length > 0) {
          // console.debug('stickyHeaderTable mounted', tableTop)
          // tableBody[0].setAttribute('style', `height:null`)
          tableTop[0].style.height = null
        }
      }, 10)
      // console.debug('stickyHeaderTable mounted cc[0]', cc[0])
      // let newClass = cc.className.split(' ')
      // newClass.push(this.className)
      // cc.className = newClass.join(' ') // .className += 'AAAAAAAAA'
      // // document.documentElement.style.setProperty('--styleName', 'AAAAAAAAA')
      // let style = this.$el.ownerDocument.createElement('style')
      // style.type = 'text/css'
      // style.appendChild(this.$el.ownerDocument.createTextNode(this.classStyle))
      // cc.appendChild(style)
    }
    // if (tableTop > 0) {
    //   // tableBody[0].setAttribute('style', `height:null`)
    //   tableTop[0].style.height = null
    // }
  },
  updated() {
    let rows = this.$el.getElementsByTagName('tr')
    for (let ele of rows) {
      ele.addEventListener('click', this.onTableRowClick, false)
    }
  },
  computed: {
    shtDataRowsCount() {
      return this.data.length
    },
    shtTrRowsCount() {
      return this.$el.getElementsByTagName('TR').length - 1
    },
    shtTrRows() {
      return null
    },
  },
  methods: {
    calcHeight(val) {
      const bottomHeight = 50
      if (this.hideBottom) {
        return val
      } else {
        return val - bottomHeight
      }
    },
    onTableRowClick(evt) {
      const tr = this.getTrElement(_.get(evt, ['target']))
      const vueTr = tr ? _.get(tr, ['__vue__']) : null
      if (vueTr) {
        let row = _.cloneDeep(_.get(vueTr, ['props', 'row']))
        // console.debug('vueTr', vueTr)
        if (row) {
          const rowIndex = _.get(row, '__index')
          delete row['__index']
          this.$emit('rowClick', rowIndex, row)
          return
        }
      }
      const rowIndex = _.get(tr, ['rowIndex'])
      if (rowIndex > 0) {
        const row = _.cloneDeep(this.data[rowIndex - 1])
        this.$emit('rowClick', rowIndex, row)
      }
    },
    getTrElement(node) {
      if (node) {
        const nodeName = _.get(node, 'nodeName')
        switch (nodeName) {
          case 'TR':
            return node
          case 'TBODY':
            return null
          default:
            return this.getTrElement(node.parentNode)
        }
      }
    },
  },
  watch: {
    tableHeight: {
      handler: function(val, oldVal) {
        if (val != oldVal) {
          if (this.$el) {
            // document.documentElement.style.setProperty(
            //   '--tableHeight',
            //   `${this.calcHeight(val)}${this.heightUnit || 'px'}`,
            // )
            // this.$el.ownerDocument.documentElement.style.setProperty(
            //   '--tableHeight',
            //   `${this.calcHeight(val)}${this.heightUnit || 'px'}`,
            // )
            const tableBody = this.$el.getElementsByClassName('q-table__middle')

            if (tableBody.length > 0) {
              tableBody[0].style.height = null
              setTimeout(() => {
                tableBody[0].setAttribute('style', `height:${this.calcHeight(val)}${this.heightUnit || 'px'}`)
                const tableTop = this.$el.getElementsByClassName('q-table__top')
                // console.debug('stickyHeaderTable watch1', tableTop)
                if (tableTop.length > 0) {
                  // console.debug('stickyHeaderTable watch2', tableTop)
                  tableTop[0].style.height = null
                }
              }, 10)
              // console.debug('stickyHeaderTable mounted cc[0]', cc[0])
            }
          }
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
// .q-table__middle {
// height: var(--tableHeight);
// }

// .q-table__top, .q-table__bottom, thead tr:first-child th {
// background-color: #eee;
// }
thead tr:first-child th {
  position: sticky;
  top: 0;
  opacity: 1;
  z-index: 1;
}
</style>
