<template lang="pug">
q-dialog(
  ref='myDialog',
  v-model='showDialog',
  :seamless='seamless',
  :persistent='persistent',
  :position='position',
  :maximized='maximizedToggle',
  :transition-show='transitionShow',
  :transition-hide='transitionHide',
  @show='onShow',
  @hide='onHide'
)
  q-card
    q-bar.bg-primary.text-white(:class='draggable ? "cursor-move" : ""')
      q-icon(v-if='titleIcon', :name='titleIcon')
      //- q-avatar
        img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
      .text-h6.text-uppercase {{ title }}
      q-space
      q-btn(
        v-if='minButton',
        dense,
        flat,
        icon='minimize',
        @click='maximizedToggle = false',
        :disable='!maximizedToggle'
      )
      q-btn(
        v-if='maxButton',
        dense,
        flat,
        icon='crop_square',
        @click='maximizedToggle = true',
        :disable='maximizedToggle'
      )
      q-btn(v-if='closeButton', dense, flat, icon='close', @click='onHide')
    slot
</template>

<script>
import draggable from '../mixin/draggable.js'
export default {
  name: 'dialogDraggable',
  mixins: [draggable],
  props: {
    value: Boolean,
    position: String,
    transitionShow: String,
    transitionHide: String,
    seamless: Boolean,
    persistent: Boolean,
    closeButton: { type: Boolean, default: true },
    maxButton: { type: Boolean, default: false },
    minButton: { type: Boolean, default: false },
    draggable: { type: Boolean, default: true },
    titleIcon: String,
    title: { type: String, default: 'Title' },
  },
  data() {
    return {
      showDialog: false,
      maximizedToggle: false,
      target: null,
      nodeDragg: null,
    }
  },
  mounted() {
    this.showDialog = this.value
  },
  watch: {
    value(val) {
      this.showDialog = val
    },
    showDialog(val) {
      this.$emit('input', val)
    },
  },

  // methods: {
  //   onShow() {
  //     let dialogElements = document.getElementsByClassName('q-dialog')
  //     this.target = dialogElements[0].querySelector('.q-card')
  //     this.nodeDragg = this.target.querySelector('.q-bar')
  //     if (this.draggable) {
  //       this.nodeDragg.addEventListener('mousedown', this.onGrab)
  //     }

  //     this.$emit('onShow')
  //   },
  //   onHide() {
  //     if (this.draggable) {
  //       document.removeEventListener('mousemove', this.onDrag)
  //       document.removeEventListener('mouseup', this.onLetGo)
  //       this.nodeDragg.removeEventListener('mousedown', this.onGrab)
  //     }
  //     this.$emit('input', false)
  //     this.$emit('onHide')
  //   },
  //   onDrag(e) {
  //     let originalStyles = window.getComputedStyle(this.target)
  //     this.target.style.left = parseInt(originalStyles.left) + e.movementX + 'px'
  //     this.target.style.top = parseInt(originalStyles.top) + e.movementY + 'px'
  //   },

  //   onLetGo() {
  //     document.removeEventListener('mousemove', this.onDrag)
  //     document.removeEventListener('mouseup', this.onLetGo)
  //   },

  //   onGrab() {
  //     document.addEventListener('mousemove', this.onDrag)
  //     document.addEventListener('mouseup', this.onLetGo)
  //   },
  // },
}
</script>

<style>
.q-dialog__inner--minimized > div {
  max-width: none !important;
}
.cursor-move {
  cursor: move;
}
</style>
