import _ from 'lodash'
import alertDialog from '../components/alertDialog.vue'

export default {
  methods: {
    showAlert({ title, type, message, position, detail, autoClose, persistent, seamless }) {
      let isClosed = false
      const defaultTimeout = 5
      const closeTime = autoClose ? (_.isNumber(autoClose) ? _.toNumber(autoClose) : defaultTimeout) : undefined

      const dialog = this.$q
        .dialog({
          component: alertDialog,
          // optional if you want to have access to
          // Router, Vuex store, and so on, in your
          // custom component:
          parent: this, // becomes child of this Vue node
          // ("this" points to your Vue component)
          // (prop was called "root" in < 1.1.0 and
          // still works, but recommending to switch
          // to the more appropriate "parent" name)

          // props forwarded to component
          // (everything except "component" and "parent" props above):
          title,
          type,
          message,
          position,
          detail,
          closeTime,
          persistent,
          seamless,
          // ...more.props...
        })
        .onDismiss(() => {
          isClosed = true
        })

      if (closeTime > 0) {
        const closeTimer = setTimeout(() => {
          if (!isClosed) {
            dialog.hide()
          }
          clearTimeout(closeTimer)
        }, closeTime * 1000)
      }
      return dialog
    },
    showAlert2({ title, type, message, position, autoClose }) {
      const defaultTimeout = 5
      let isClosed = false
      const icon = {
        positive: `<i aria-hidden="true" role="presentation" class="text-positive material-icons q-icon notranslate" style="font-size: 32px;">check_circle</i>`, //_outline
        negative: `<i aria-hidden="true" role="presentation" class="text-negative material-icons q-icon notranslate" style="font-size: 32px;">cancel</i>`,
        warning: `<i aria-hidden="true" role="presentation" class="text-warning material-icons q-icon notranslate" style="font-size: 32px;">warning</i>`,
        info: `<i aria-hidden="true" role="presentation" class="text-info material-icons q-icon notranslate" style="font-size: 32px;">info</i>`,
      }
      const html =
        type && icon[type]
          ? `<div class="row"><div class="col-1 q-ma-sm">${icon[type]}</div><div class="col q-ma-sm" style="white-space: pre-wrap;">${message}</div></div>`
          : `<div class="row"><div class="col q-ma-sm" style="white-space: pre-wrap;">${message}</div>`
      const dialog = this.$q
        .dialog({
          title,
          message: html,
          position,
          persistent: true,
          html: true,
        })
        .onDismiss(() => {
          isClosed = true
        })

      if (autoClose) {
        const closeTime = _.isNumber(autoClose) ? _.toNumber(autoClose) : defaultTimeout
        const closeTimer = setTimeout(() => {
          if (!isClosed) {
            dialog.hide()
          }
          clearTimeout(closeTimer)
        }, closeTime * 1000)
      }

      return dialog
    },
    // showQuestion({ title, message, position, autoClose, persistent, seamless, defaultValue }) {
    //   const dialog = this.$q.dialog
    //   return dialog
    // },
    // showPrompt({ title, message, position, autoClose, persistent, seamless, defaultValue }) {
    //   const dialog = this.$q.dialog
    //   return dialog
    // },
  },
}
