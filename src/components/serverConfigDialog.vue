<template lang="pug">
draggable-dialog(
  v-if='showDialog',
  v-model='showDialog',
  persistent,
  titleIcon='laptop_chromebook',
  :title='$t("serverConfigDialog.title")'
)
  q-card(style='min-width:40vw')
    //- q-bar
      q-avatar
        img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
      q-toolbar-title
        span.text-weight-bold {{ $t("serverConfigDialog.title") }}
      //- q-btn(
        flat
        round
        dense
        icon='close'
        v-close-popup
        )
    q-card-section
      q-form(@submit='onSubmit', @reset='onReset')
        q-input(
          v-model='name',
          :label='$t("serverConfigDialog.nameLabel")',
          filled,
          lazy-rules,
          :disable='!isCreate',
          :rules='[(val) => (val && val.length > 0) || `${$t("requestTip")}`]'
        )
        q-input(
          v-model='connString',
          type='textarea',
          :label='$t("serverConfigDialog.valueLabel")',
          filled,
          lazy-rules,
          :rules='[(val) => (val && val.length > 0) || `${$t("requestTip")}`]'
        )
        q-input(v-model='options', type='textarea', :label='$t("serverConfigDialog.optionsLabel")', filled, lazy-rules)
        hr(style='filter: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15);')
        q-toolbar
          q-space
          q-btn.q-ml-sm(:label='$t("save")', type='submit', color='primary')
          q-btn.q-ml-sm(:label='$t("cancel")', type='reset', color='primary', flat)
</template>

<script>
import _ from 'lodash'
import draggableDialog from './dialogDraggable'
import { mapMutations } from 'vuex'
import vue from 'vue'
export default {
  name: 'connnectionConfig',
  components: { draggableDialog },
  props: {
    value: Boolean,
    editData: Object,
  },
  // updated() {
  //   this.editing = {}
  // },
  data() {
    return {
      showDialog: false,
      editing: {},
    }
  },
  mounted() {
    this.showDialog = this.value
  },
  computed: {
    isCreate() {
      return _.isNil(_.get(this.editData, ['name']))
    },
    name: {
      get() {
        return _.get(this.editing, ['name'])
      },
      set(val) {
        vue.set(this.editing, 'name', val)
      },
    },
    connString: {
      get() {
        return _.get(this.editing, ['connString'])
      },
      set(val) {
        vue.set(this.editing, 'connString', val)
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
    ...mapMutations('master', ['saveServerConfig']),
    onSubmit() {
      this.saveServerConfig({ name: this.name, connString: this.connString, options: this.options })
      this.$emit('input', false)
    },
    onReset() {
      this.$emit('input', false)
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
        this.editing = _.cloneDeep(val)
      },
    },
  },
}
</script>
