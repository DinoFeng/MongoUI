<template lang="pug">
  q-dialog(
    v-if='value'
    v-model='value'
    transition-show='none'
    persistent
    )
    q-card(style='min-width:60vw')
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
          span {{commandMode}} *
          ace-editor(
            v-model='command'
            theme='tomorrow'
            mode='json'
            :maxLines='28'
            :minLines='18'
            )
          //- q-input(
            v-model='command'
            :rules="[ val => val && val.length > 0 && canJsonParse(val) || `${$t('requestJsonParseTip')}`]"
            :label='`${commandMode} *`'
            type='textarea'
            debounce='500'
            filled
            lazy-rules
            )
          span options
          ace-editor(
            v-model='options'
            theme='kuroir'
            mode='json'
            :maxLines='10'
            :minLines='10'
            )
          //- q-input(
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
import eJson from 'mongodb-extjson'
import aceEditor from './ace-editor'
import vue from 'vue'
export default {
  name: 'queryDialog',
  components: { aceEditor },
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
    const { command, options } = this.commandData || {}
    this.editing = {
      command: command ? eJson.stringify(command, null, 4, { relaxed: true }) : command,
      options: options ? eJson.stringify(options, null, 4, { relaxed: true }) : options,
    }
  },
  computed: {
    command: {
      get() {
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
        v && eJson.parse(v)
        return true
      } catch {
        return false
      }
    },
    onSubmit() {
      try {
        const { command: c, options: o } = this.editing
        const command = c ? eJson.parse(c) : undefined
        const options = o ? eJson.parse(o) : undefined
        this.$emit('update:commandData', { command, options })
        this.$emit('input', false)
        this.$emit('submit')
      } catch {}
    },
    onReset() {
      this.$emit('input', false)
      this.$emit('cancel')
    },
  },
  // watch: {
  //   commandData: {
  //     deep: true,
  //     // immediate: true,
  //     handler: function(val) {
  //       const { command, options } = val || {}
  //       // this.editing = { command, options }
  //       this.editing = {
  //         command: command ? eJson.stringify(command, null, 4) : command,
  //         options: options ? eJson.stringify(options, null, 4) : options,
  //       }
  //     },
  //   },
  // },
}
</script>
