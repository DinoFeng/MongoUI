<template lang="pug">
  q-dialog(
    v-if='value'
    v-model='value'
    persistent
    )
    q-card(style='min-width:80vw')
      q-toolbar
        q-avatar
          img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
        q-toolbar-title
          .text-uppercase.text-weight-bold {{title}}
          .text-caption {{editTable}}
      q-card-section
        q-form(
          @submit='onSubmit'
          @reset='onReset'
          )
          span {{$t("record")}} *
          ace-editor(
            v-model='editing'
            theme='tomorrow'
            mode='json'
            :maxLines='28'
            :minLines='18'
            )
          //- span options
          //- ace-editor(
            v-model='options'
            theme='kuroir'
            mode='javascript'
            :maxLines='10'
            :minLines='10'
            )
          //- chrome clouds crimson_editor dawn
          //- q-input(
            v-model='editing'
            :rules="[ val => val && val.length > 0 && canJsonParse(val) || `${$t('requestJsonParseTip')}`]"
            :rows='16'
            :label='`${$t("record")} *`'
            type='textarea'
            debounce='500'
            filled
            lazy-rules
            )
          //- q-label
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
            //- q-btn.q-ml-sm(
            //-   :label='$t("validate")'
            //-   color='primary'
            //-   )
            q-space
            q-btn.q-ml-sm(
              :label='$t("save")'
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
// import _ from 'lodash'
// import { mapMutations } from 'vuex'
// import vue from 'vue'
// const aceEditor = () => import('./ace-editor.vue')
import aceEditor from './ace-editor'
import eJson from 'mongodb-extjson'
export default {
  name: 'queryDialog',
  components: { aceEditor },
  props: {
    value: Boolean,
    editTable: String,
    editKey: [String, Object, Number],
    editData: Object,
  },
  mounted() {
    this.editing = eJson.stringify(this.editData, null, 4, { relaxed: true }) // JSON.stringify(this.editData, null, 4)
  },
  data() {
    return {
      editing: '',
      options: '',
    }
  },
  computed: {
    title() {
      return `${this.editKey ? this.$t('modify') : this.$t('create')}`
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
    parseEditData(editData) {
      try {
        return eJson.parse(editData)
      } catch {
        return null
      }
    },
    onSubmit() {
      // this.$emit('submit', this.editKey, this.editing, this.editTable, JSON.parse(this.options))
      const submitData = this.parseEditData(this.editing)
      if (submitData) {
        this.$emit('input', false)
        this.$emit('submit', this.editKey, this.editing, this.editTable)
      }
    },
    onReset() {
      this.$emit('input', false)
      this.$emit('cancel')
    },
  },
  watch: {
    editData: {
      deep: true,
      // immediate: true,
      handler: function(val) {
        this.editing = JSON.stringify(val, null, 4)
      },
    },
  },
}
</script>
