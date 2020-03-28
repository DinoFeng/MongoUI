<template lang="pug">
  q-layout(view='hHh lPr fFf')
    q-header(elevated)
      q-toolbar
        q-btn(
          flat
          dense
          round
          @click='setLeftDrawerOpen(!leftDrawerOpen)'
          icon='menu'
          aria-label='Menu'
          )
        q-toolbar-title Mongo UI
        q-btn-dropdown(
          flat
          )
          template(v-slot:label)
            .row
              | Language
              q-icon.on-right(
                right 
                :name='`img:statics/flag/${language}.png`'
                style='width:32px;height:21px;'
                )
          q-list
            q-item(
              clickable
              v-close-popup
              @click='choiseLanguage("en-us")'
              )
              q-item-section English
              q-item-section(avatar)
                q-icon(
                  name='img:statics/flag/en-us.png'
                  style='width:32px;height:21px;'
                  )
            q-item(
              clickable
              v-close-popup
              @click='choiseLanguage("zh-cn")'
              )
              q-item-section 简体中文
              q-item-section(avatar)
                q-icon(
                  name='img:statics/flag/zh-cn.png'
                  style='width:32px;height:21px;'
                  )
    q-footer
      q-toolbar
        q-toolbar-title Version {{ver}}
        div Build with Quasar v{{ $q.version }}
    //- q-page-container
    router-view
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import cfg from '../statics/config/config'
export default {
  name: 'MyLayout',
  mounted() {
    this.language = window.navigator.language.toLowerCase()
  },
  data() {
    return {
      language: null,
    }
  },
  computed: {
    ...mapState('master', ['leftDrawerOpen']),
    ver() {
      return cfg.version || ''
    },
  },
  methods: {
    ...mapMutations('master', ['setLeftDrawerOpen']),
    choiseLanguage(lan) {
      this.language = lan
      console.debug('choiseLanguage', lan)
      // this.$i18n.locale = lan
    },
  },
  watch: {
    language: {
      handler(val) {
        this.$i18n.locale = val
      },
    },
  },
}
</script>
