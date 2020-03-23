<template lang="pug">
  q-dialog(
    ref='dialog' 
    :seamless='seamless'
    :persistent='persistent'
    :position='position'
    @hide='onDialogHide'
    )
    q-card.q-dialog-plugin
      q-card-section
        .text-h6 {{title}}
      q-card-section
        .row
          .col.q-ma-sm.text-body1 {{message}}
        .row
          q-input.col(
            v-model='text'
            debounce='500'
            autofocus
            @focus='onFocus'
            )
      //- buttons example
      q-card-actions(align='right')
        q-btn(
          color='primary'
          label='OK'
          flat
          @click='onOKClick')
        q-btn(
          color='primary'
          label='Cancel'
          flat
          @click='onCancelClick'
          )
</template>

<script>
export default {
  props: {
    closeTime: Number,
    title: String,
    message: String,
    defaultValue: String,
    position: String,
    seamless: Boolean,
    persistent: Boolean,
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
    }
    this.text = this.defaultValue || ''
  },
  data() {
    return {
      timer: 0,
      text: '',
    }
  },
  computed: {},
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
