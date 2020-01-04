<template lang="pug">
  q-form(
    @submit='onSubmit'
    @reset='onReset'
    )
    q-input(
      v-model='name'
      label='Server name *'
      filled
      lazy-rules
      :disable='!isCreate'
      :rules="[ val => val && val.length > 0 || 'Please type something']"
      )
    q-input(
      v-model='connection'
      type='textarea'
      label='Connection string *'
      filled
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Please type something']"
      )
    q-input(
      v-model='options'
      type='textarea'
      label='Connection options'
      filled
      lazy-rules
      )
    hr(style='filter: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15);')
    q-toolbar
      q-space
      q-btn.q-ml-sm(
        label='Create'
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
export default {
  name: 'connnectionConfig',
  props: {
    editData: Object,
  },
  mounted() {
    if (!_.isNil(this.editData)) {
      this.name = this.editData.name
      this.connection = this.editData.connection
      this.options = this.editData.options
    }
  },
  data() {
    return {
      name: null,
      connection: null,
      options: null,
    }
  },
  computed: {
    isCreate() {
      return _.isNil(_.get(this.editData, ['name']))
    },
  },
  methods: {
    onSubmit() {
      this.$emit('saveConfig', {
        name: this.name,
        connection: this.connection,
        options: this.options,
      })
    },
    onReset() {
      this.$emit('closeDialog')
    },
  },
}
</script>
