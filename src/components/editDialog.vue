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
          q-input(
            v-model='editing'
            :rules="[ val => val && val.length > 0 && canJsonParse(val) || `${$t('requestJsonParseTip')}`]"
            :rows='20'
            :label='`${$t("record")} *`'
            type='textarea'
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
export default {
  name: 'queryDialog',
  props: {
    value: Boolean,
    editTable: String,
    editKey: [String, Object],
    editData: Object,
  },
  mounted() {
    this.editing = JSON.stringify(this.editData, null, 4)
  },
  data() {
    return {
      editing: '',
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
    onSubmit() {
      this.$emit('input', false)
      this.$emit('submit', this.editKey, JSON.parse(this.editing), this.editTable)
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
