<template lang="pug">
q-dialog(
  ref='dialog',
  :seamless='seamless',
  :persistent='persistent',
  :position='position',
  @hide='onDialogHide',
  @show='onShow'
)
  q-card.q-dialog-plugin
    q-bar.bg-primary.text-white(:class='draggable ? "cursor-move" : ""')
      q-icon(v-if='titleIcon', :name='titleIcon')
      .text-h6 {{ title }}
      q-space
    //- q-card-section
      .text-h6 {{ title }}
    q-card-section
      .row
        .col-1.q-ma-sm
          q-icon.text-secondary(name='help', style='font-size: 36px;')
        .col.q-ma-sm.text-body1 {{ message }}
    //- buttons example
    q-card-actions(align='right')
      q-btn(color='primary', flat, :label='labelOK', :autofocus='!defaultCancel', @click='onOKClick')
      q-btn(color='primary', flat, :label='labelCancel', :autofocus='defaultCancel', @click='onCancelClick')
</template>

<script>
import draggable from '../mixin/draggable.js'
export default {
  mixins: [draggable],
  props: {
    closeTime: Number,
    title: String,
    message: String,
    defaultCancel: Boolean,
    okLabel: String,
    cancelLabel: String,
    position: String,
    seamless: Boolean,
    persistent: Boolean,
    titleIcon: String,
    draggable: { type: Boolean, default: true },
  },
  mounted() {
    if (this.closeTime > 0) {
      this.timer = this.closeTime
      const interval = setInterval(() => {
        --this.timer
        if (this.timer <= 0) {
          clearInterval(interval)
        }
      }, 1000)

      const closeTimeout = setTimeout(() => {
        if (this.$refs.dialog) {
          if (this.defaultCancel) {
            this.hide()
          } else {
            this.onOKClick()
          }
        }
        clearTimeout(closeTimeout)
      }, this.closeTime * 1000)
    }
  },
  data() {
    return {
      timer: 0,
    }
  },
  computed: {
    labelOK() {
      const label = this.okLabel || this.$t('ok')
      return this.closeTime > 0 && !this.defaultCancel ? `${label} (${this.timer})` : label
    },
    labelCancel() {
      const label = this.cancelLabel || this.$t('cancel')
      return this.closeTime > 0 && this.defaultCancel ? `${label} (${this.timer})` : label
    },
  },
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show()
    },
    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide()
    },
    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
      this.onHide()
    },
    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', true)
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },
    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    },
    onFocus(evt) {
      // console.debug(evt)
      evt.target.select()
    },
  },
}
</script>
<style lang="stylus" scoped>
.q-dialog-plugin {
  width: 500px;
  max-width: 80vw;
}
</style>
