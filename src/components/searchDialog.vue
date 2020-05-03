<template lang="pug">
  q-dialog(
    v-if='value'
    v-model='value'
    transition-show='none'
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
            :rules="[ val => val && val.length > 0 || `${$t('requestTip')}`]"
            :label='$t("field")'
            debounce='500'
            filled
            lazy-rules
            use-input
            hide-selected
            fill-input
            @input-value="setValue"
            )
          q-option-group(
            v-model='inputType'
            :options='valueTypes'
            type='radio'
            inline
            dense
          )
          q-input(
            v-if='!inputIsObject'
            v-model='inputValue'
            :rules="[ val => !isEmpty(val) || `${$t('requestTip')}`]"
            :label='$t("value")'
            debounce='500'
            filled
            lazy-rules
            )
          ace-editor(
            v-if='inputIsObject'
            v-model='inputValue'
            :minLines='6'
            :maxLines='6'
            mode='json'
            theme='tomorrow'
            )
          hr(style='filter: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15);')
          q-toolbar
            //- .col.remined.text-negative
            //-   .row ObjectId("")=>{"$oid":""}
            //-   .row Date("")=>{"$date":""}
            q-space
            q-btn.q-ml-sm(
              :label='$t("search")'
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
import { mapGetters } from 'vuex'
import eJson from 'mongodb-extjson'
import aceEditor from './ace-editor'
import vue from 'vue'
import tools from '../util/tools'
const genValue = {
  string: v => v,
  number: v => {
    const n = _.toNumber(v)
    return !_.isNaN(n) ? n : null
  },
  date: v => ({ $date: v }),
  objectId: v => ({ $oid: v }),
  object: v => {
    try {
      return v && eJson.parse(v)
    } catch {
      return null
    }
  },
}
const typesMapping = {
  String: 'string',
  ObjectId: 'objectId',
  Int32: 'number',
  Long: 'number',
  Double: 'number',
  Decimal128: 'number',
  Date: 'date',
}
export default {
  name: 'searchDialog',
  components: { aceEditor },
  props: {
    value: Boolean,
    commandData: Object,
  },
  data() {
    return {
      editing: {},
      inputType: 'string',
      valueTypes: [
        { label: 'String', value: 'string', size: 'xs' },
        { label: 'Numer', value: 'number', size: 'xs' },
        { label: 'Date', value: 'date', size: 'xs' },
        { label: 'ObjectId', value: 'objectId', size: 'xs' },
        { label: 'Object', value: 'object', size: 'xs' },
      ],
    }
  },
  mounted() {
    const { command } = this.commandData || {}
    const selectedField = command ? _.get(Object.keys(command), [0]) || '' : ''
    const v = _.get(command, [selectedField]) || ''
    const value = tools.parseBson(v)
    // console.debug({ value })
    this.inputType = _.get(typesMapping, [value.type]) || 'object'
    const inputValue = this.inputType === 'object' ? eJson.stringify(v, null, 4) : JSON.parse(JSON.stringify(v))

    this.editing = {
      selectedField,
      inputValue,
    }
  },
  computed: {
    ...mapGetters('master', ['resultFields']),
    inputIsObject() {
      return this.inputType === 'object'
    },
    fields() {
      if (this.selectedField) {
        return this.resultFields.filter(v => v.toLocaleLowerCase().indexOf(this.selectedField.toLocaleLowerCase()) > -1)
      } else {
        return this.resultFields
      }
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
    command() {
      const { selectedField: f, inputValue: v } = this.editing
      if (!this.isEmpty(v)) {
        return eJson.parse(eJson.stringify({ [f]: genValue[this.inputType](v) }, { relaxed: true }), { relaxed: true })
      } else {
        return null
      }
    },
  },
  methods: {
    isEmpty(v) {
      // console.debug(_.isNil(v), _.isEmpty(v))
      return _.isNil(v) || v === ''
    },
    canJsonParse(v) {
      try {
        return v && eJson.parse(v)
      } catch {
        return null
      }
    },
    setValue(val) {
      this.selectedField = val
    },
    onSubmit() {
      // const { selectedField: f, inputValue: v } = this.editing
      // const command = { [f]: v }
      const command = this.command
      // console.debug({ command })
      // const options = undefined
      if (command) {
        this.$emit('update:commandData', { command })
        this.$emit('input', false)
        this.$emit('submit')
      }
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
<style scoped>
.remined {
  font-size: 12px;
}
</style>
