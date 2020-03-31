<template lang="pug">
  q-dialog(
    v-if='value'
    v-model='value'
    persistent
    )
    q-card(style='min-width:40vw')
      q-toolbar
        q-avatar
          img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
        q-toolbar-title
          span.text-uppercase.text-weight-bold {{commandMode}}
      q-card-section
        q-form(
          @submit='onSubmit'
          @reset='onReset'
          )
          q-input(
            v-model='command'
            :rules="[ val => val && val.length > 0 && canJsonParse(val) || `${$t('requestJsonParseTip')}`]"
            :label='`${commandMode} *`'
            type='textarea'
            debounce='500'
            filled
            lazy-rules
            )
          q-input(
            v-model='options'
            :rules="[ val => val?(val && val.length > 0 && canJsonParse(val) || `${$t('requestJsonParseTip')}`):true]"
            type='textarea'
            label='options'
            debounce='500'
            filled
            lazy-rules
            )
          hr(style='filter: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15);')
          q-toolbar
            q-space
            q-btn.q-ml-sm(
              :label='$t("run")'
              type='submit'
              color='primary'
              )
            q-btn.q-ml-sm(
              :label='$t("cancel")'
              type='reset'
              color='primary'
              flat
              )
</template>

<script>
import _ from 'lodash'
// import { mapMutations } from 'vuex'
import vue from 'vue'
export default {
  name: 'queryDialog',
  props: {
    value: Boolean,
    commandData: Object,
    commandMode: String,
  },
  data() {
    return {
      editing: {},
    }
  },
  mounted() {
    // console.debug('queryDialog mounted')
    const { command, options } = this.commandData
    this.editing = {
      command: command ? JSON.stringify(command) : command,
      options: command ? JSON.stringify(options) : options,
    }
  },
  computed: {
    command: {
      get() {
        // console.debug('get command', _.get(this.editing, ['command']))
        return _.get(this.editing, ['command'])
      },
      set(val) {
        vue.set(this.editing, 'command', val)
      },
    },
    options: {
      get() {
        return _.get(this.editing, ['options'])
      },
      set(val) {
        vue.set(this.editing, 'options', val)
      },
    },
  },
  methods: {
    canJsonParse(v) {
      try {
        JSON.parse(v)
        return true
      } catch {
        return false
      }
    },
    onSubmit() {
      const { command: c, options: o } = this.editing
      const command = JSON.parse(c)
      const options = o ? JSON.parse(o) : undefined
      this.$emit('update:commandData', { command, options })
      this.$emit('input', false)
      this.$emit('submit')
    },
    onReset() {
      this.$emit('input', false)
      this.$emit('cancel')
    },
  },
  watch: {
    commandData: {
      deep: true,
      // immediate: true,
      handler: function(val) {
        // console.debug('watch commandData', val)
        const { command, options } = val
        this.editing = {
          command: command ? JSON.stringify(command) : command,
          options: command ? JSON.stringify(options) : options,
        }
      },
    },
  },
}
</script>
