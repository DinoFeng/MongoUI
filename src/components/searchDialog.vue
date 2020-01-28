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
          span.text-uppercase.text-weight-bold {{ $t('search') }}
      q-card-section
        q-form(
          @submit='onSubmit'
          @reset='onReset'
          )
          q-select(
            v-model='selectedField'
            :options='fields'
            :rules="[ val => val && val.length > 0 || 'Please type something that can JSON parse.']"
            label='field'
            debounce='500'
            filled
            lazy-rules
            )
          q-input(
            v-model='inputValue'
            :rules="[ val => val && val.length > 0 || 'Please type something that can JSON parse.']"
            label='value'
            debounce='500'
            filled
            lazy-rules
            )
          hr(style='filter: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15);')
          q-toolbar
            q-space
            q-btn.q-ml-sm(
              label='Search'
              type='submit'
              color='primary'
              )
            q-btn.q-ml-sm(
              label='Cancel'
              type='reset'
              color='primary'
              flat
              )
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import vue from 'vue'
export default {
  name: 'searchDialog',
  props: {
    value: Boolean,
    commandData: Object,
  },
  data() {
    return {
      editing: {},
    }
  },
  computed: {
    ...mapGetters('master', ['resultFields']),
    fields() {
      return this.resultFields
    },
    selectedField: {
      get() {
        return _.get(this.editing, ['selectedField'])
      },
      set(val) {
        vue.set(this.editing, 'selectedField', val)
      },
    },
    inputValue: {
      get() {
        return _.get(this.editing, ['inputValue'])
      },
      set(val) {
        vue.set(this.editing, 'inputValue', val)
      },
    },
  },
  methods: {
    onSubmit() {
      const { selectedField: f, inputValue: v } = this.editing
      const command = { [f]: v }
      const options = undefined
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
        const { command } = val || {}
        const selectedField = command ? _.get(Object.keys(command), [0]) || '' : ''
        const inputValue = _.get(command, [selectedField]) || ''

        this.editing = {
          selectedField,
          inputValue,
        }
      },
    },
  },
}
</script>
