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
        .col-1.q-ma-sm(v-if='!!icon')
          q-icon(v-if='!!icon', :name='icon', :class='`text-${type}`', style='font-size: 36px;')
        .col.q-ma-sm.text-body1 {{ message }}
    q-card-section(v-if='!!detail', align='right')
      a(href='javascript:void(0)', @click='() => (detailShow = !detailShow)') {{ $t("detail") }}
    q-card-section(v-if='!!detail && detailShow')
      q-scroll-area.q-dialog-detail-section.text-caption {{ detail }}
    //- buttons example
    q-card-actions(align='right')
      q-btn(color='primary', flat, autofocus, :label='labelOK', @click='onOKClick')
      //- q-btn(color='primary', label='Cancel', @click='onCancelClick')
</template>

<script>
import draggable from '../mixin/draggable.js'
export default {
  mixins: [draggable],
  props: {
    title: String,
    message: String,
    type: String,
    okLabel: String,
    position: String,
    detail: String,
    closeTime: Number,
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
          this.onOKClick()
        }
        clearTimeout(closeTimeout)
      }, this.closeTime * 1000)
    }
  },
  data() {
    return {
      timer: 0,
      detailShow: false,
    }
  },
  computed: {
    icon() {
      const i = {
        positive: 'check_circle',
        negative: 'cancel',
        warning: 'warning',
        info: 'info',
      }
      return i[this.type]
    },
    labelOK() {
      const label = this.okLabel || this.$t('ok')
      return this.closeTime > 0 && !this.defaultCancel ? `${label} (${this.timer})` : label
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
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },
    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    },
  },
}
</script>
<style lang="stylus" scoped>
.q-dialog-plugin {
  width: 500px;
  max-width: 80vw;
}

.q-dialog-detail-section {
  width: 100%;
  height: 200px;
  max-height: 500px;
  // white-space: normal;
  word-wrap: break-word;
  // word-break: break-all;
}

a:link {
  text-decoration: none;
  color: blue;
}

a:active {
  text-decoration: blink;
}

a:hover {
  text-decoration: none;
  color: red;
}

a:visited {
  text-decoration: none;
  color: green;
}
</style>
