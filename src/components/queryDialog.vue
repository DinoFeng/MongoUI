<template lang="pug">
draggable-dialog(
  v-if='showDialog',
  v-model='showDialog',
  transition-show='none',
  persistent,
  titleIcon='search',
  :title='commandMode'
)
  q-card(style='min-width:60vw')
    //- q-toolbar
      q-avatar
        img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
      q-toolbar-title
        span.text-uppercase.text-weight-bold {{ commandMode }}
    q-card-section
      q-form(@submit='onSubmit', @reset='onReset')
        span {{ commandMode }} *
        ace-editor(v-model='command', :minLines='18', :maxLines='18', mode='json', theme='tomorrow')
        span options
        ace-editor(v-model='options', :minLines='10', :maxLines='10', mode='json', theme='kuroir')
        hr(style='filter: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15);')
        q-toolbar
          .col.remined.text-negative
            .row ObjectId("")=>{"$oid":""}
            .row Date("")=>{"$date":""}
          q-space
          q-btn.q-ml-sm(:label='$t("run")', type='submit', color='primary')
          q-btn.q-ml-sm(:label='$t("cancel")', type='reset', color='primary', flat)
</template>

<script>
import _ from 'lodash'
// import { mapMutations } from 'vuex'
import draggableDialog from './dialogDraggable'
import eJson from 'mongodb-extjson'
import aceEditor from './ace-editor'
import vue from 'vue'
export default {
  name: 'queryDialog',
  components: {
    aceEditor,
    draggableDialog,
  },
  props: {
    value: Boolean,
    commandData: Object,
    commandMode: String,
  },
  data() {
    return {
      editing: {},
      showDialog: false,
    }
  },
  mounted() {
    const { command, options } = this.commandData || {}
    this.editing = {
      command: command ? eJson.stringify(command, null, 4, { relaxed: true }) : command,
      options: options ? eJson.stringify(options, null, 4, { relaxed: true }) : options,
    }
    this.showDialog = this.value
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
  watch: {
    value(val) {
      this.showDialog = val
    },
    showDialog(val) {
      this.$emit('input', val)
    },
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
  },
}
</script>
<style scoped>
.remined {
  font-size: 12px;
}
</style>
