<template lang="pug">
draggable-dialog(
  v-if='showDialog',
  v-model='showDialog',
  transition-show='none',
  persistent,
  :titleIcon='titleIcon',
  :title='title'
)
  q-card(style='min-width:80vw')
    q-card-section(v-if='navigation')
      q-breadcrumbs
        q-breadcrumbs-el(v-if='navigation && navigation.server' :label='navigation.server', icon='fas fa-desktop')
        q-breadcrumbs-el(v-if='navigation && navigation.db' :label='navigation.db', icon='fas fa-database')
        q-breadcrumbs-el(v-if='navigation && navigation.table' :label='navigation.table', icon='fas fa-table')
    //- q-toolbar
      q-avatar
        img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
      q-toolbar-title
        .text-uppercase.text-weight-bold {{ title }}
        .text-caption {{ editTable }}
    q-card-section
      q-form(@submit='onSubmit', @reset='onReset')
        span {{ $t("record") }} *
        ace-editor(
          v-model='editing',
          :maxLines='28',
          :minLines='18',
          mode='json',
          :theme='readonly ? "kuroir" : "tomorrow"',
          :readonly='readonly'
        )
        hr(style='filter: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15);')
        q-toolbar
          .col.remined.text-negative
            .row ObjectId("")=>{"$oid":""}
            .row Date("")=>{"$date":""}
          q-space
          q-btn.q-ml-sm(v-if='!readonly', :label='$t("save")', type='submit', color='primary')
          q-btn.q-ml-sm(:label='cancelLabel', type='reset', color='primary', flat)
</template>

<script>
// const aceEditor = () => import('./ace-editor.vue')
import aceEditor from './ace-editor'
import draggableDialog from './dialogDraggable'
import eJson from 'mongodb-extjson'
export default {
  name: 'editDialog',
  components: {
    aceEditor,
    draggableDialog,
  },
  props: {
    value: Boolean,
    editTable: String,
    editKey: [String, Object, Number],
    editData: Object,
    readonly: Boolean,
    navigation: Object,
  },
  mounted() {
    this.editing = eJson.stringify(this.editData, null, 4, { relaxed: true }) // JSON.stringify(this.editData, null, 4)
    this.showDialog = this.value
  },
  data() {
    return {
      showDialog: false,
      editing: '',
      options: '',
    }
  },
  computed: {
    title() {
      return `${this.readonly ? this.$t('browse') : this.editKey ? this.$t('modify') : this.$t('create')}`
    },
    titleIcon() {
      return `${this.readonly ? 'import_contacts' : this.editKey ? 'edit' : 'create'}`
    },
    cancelLabel() {
      return `${this.readonly ? this.$t('close') : this.$t('cancel')}`
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
    value(val) {
      this.showDialog = val
    },
    showDialog(val) {
      this.$emit('input', val)
    },
    editData: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.editing = JSON.stringify(val, null, 4)
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
