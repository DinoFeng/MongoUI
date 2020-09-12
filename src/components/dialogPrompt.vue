<template lang="pug">
q-dialog(
  ref='dialog',
  :seamless='seamless',
  :persistent='persistent',
  :position='position',
  @hide='onDialogHide',
  @show='onShow'
)
  //- q-form(@submit='onOKClick', @reset='onCancelClick')
  q-card.q-dialog-plugin
    q-bar.bg-primary.text-white(:class='draggable ? "cursor-move" : ""')
      q-icon(v-if='titleIcon', :name='titleIcon')
      .text-h6 {{ title }}
      q-space
    q-form(@submit='onOKClick', @reset='onCancelClick')
      //- q-card-section
        .text-h6 {{ title }}
      q-card-section
        .row
          .col.q-ma-sm.text-body1 {{ message }}
        .row
          q-input.col(v-model='text', debounce='500', :autofocus='!defaultValue', :rules='rules', @focus='onFocus')
      //- buttons example
      q-card-actions(align='right')
        q-btn(type='submit', color='primary', flat, :label='labelOK', :autofocus='!defaultCancel')
        q-btn(type='reset', color='primary', flat, :label='labelCancel', :autofocus='defaultCancel')
</template>

<script>
import _ from 'lodash'
import draggable from '../mixin/draggable.js'
export default {
  mixins: [draggable],
  props: {
    closeTime: Number,
    title: String,
    message: String,
    defaultValue: String,
    defaultCancel: Boolean,
    okLabel: String,
    cancelLabel: String,
    position: String,
    seamless: Boolean,
    persistent: Boolean,
    titleIcon: String,
    draggable: { type: Boolean, default: true },
    validate: Function,
  },
  mounted() {
    if (this.closeTime > 0) {
      this.timer = this.closeTime
      this.timerIntrval = setInterval(() => {
        --this.timer
        if (this.timer <= 0 && !_.isNil(this.timerIntrval)) {
          clearInterval(this.timerIntrval)
          this.timerIntrval = null
        }
      }, 1000)

      this.closeTimeout = setTimeout(() => {
        if (this.$refs.dialog) {
          if (this.defaultCancel) {
            this.hide()
          } else {
            this.onOKClick()
          }
        }
        if (!_.isNil(this.closeTimeout)) {
          clearTimeout(this.closeTimeout)
          this.closeTimeout = null
        }
      }, this.closeTime * 1000)
    }
    this.text = this.defaultValue || ''
  },
  data() {
    return {
      timer: 0,
      text: '',
      closeTimeout: null,
      timerIntrval: null,
    }
  },
  computed: {
    labelOK() {
      const label = this.okLabel || this.$t('ok')
      return this.timerIntrval && this.closeTime > 0 && !this.defaultCancel ? `${label} (${this.timer})` : label
    },
    labelCancel() {
      const label = this.cancelLabel || this.$t('cancel')
      return this.timerIntrval && this.closeTime > 0 && this.defaultCancel ? `${label} (${this.timer})` : label
    },
    rules() {
      return this.validate ? [this.validate] : undefined
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
      this.$emit('ok', this.text)
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
      if (!_.isNil(this.timerIntrval)) {
        clearInterval(this.timerIntrval)
        this.timerIntrval = null
      }

      if (!_.isNil(this.closeTimeout)) {
        clearTimeout(this.closeTimeout)
        this.closeTimeout = null
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.q-dialog-plugin {
  width: 500px;
  max-width: 80vw;
}

.cursor-move {
  cursor: move;
}
</style>
