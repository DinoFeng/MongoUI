import _ from 'lodash'
import alertDialog from '../components/dialogAlert.vue'
import promptDialog from '../components/dialogPrompt.vue'
import confirmDialog from '../components/dialogConfirm.vue'

export default {
  methods: {
    showDialog(dialogComponent, autoClose, options) {
      // let isClosed = false
      const defaultTimeout = 5
      const closeTime = autoClose ? (_.isNumber(autoClose) ? _.toNumber(autoClose) : defaultTimeout) : undefined

      const dialog = this.$q.dialog({
        component: dialogComponent,
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
        closeTime,
        ...options,
        // ...more.props...
      })
      // .onDismiss(() => {
      //   isClosed = true
      // })

      // if (closeTime > 0) {
      //   const closeTimer = setTimeout(() => {
      //     if (!isClosed) {
      //       dialog.hide()
      //     }
      //     clearTimeout(closeTimer)
      //   }, closeTime * 1000)
      // }
      return dialog
    },

    showAlert({ title, type, message, position, detail, autoClose, persistent, seamless }) {
      return this.showDialog(alertDialog, autoClose, { title, type, message, position, detail, persistent, seamless })
    },

    showPrompt({
      title,
      message,
      defaultValue,
      autoClose,
      position,
      persistent,
      seamless,
      defaultCancel,
      cancelLabel,
      okLabel,
      validate,
    }) {
      return this.showDialog(promptDialog, defaultValue ? autoClose : false, {
        title,
        message,
        defaultValue,
        position,
        persistent,
        seamless,
        defaultCancel,
        okLabel,
        cancelLabel,
        validate,
      })
    },

    showConfirm({ title, message, position, autoClose, persistent, seamless, defaultCancel, cancelLabel, okLabel }) {
      return this.showDialog(confirmDialog, autoClose, {
        title,
        message,
        defaultCancel,
        position,
        persistent,
        seamless,
        okLabel,
        cancelLabel,
      })
    },
  },
}
