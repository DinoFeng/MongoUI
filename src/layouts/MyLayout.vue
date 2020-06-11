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
        q-toolbar-title {{revision}}
        div Build with Quasar v{{ $q.version }}
    //- q-page-container
    router-view
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
// import cfgs from '../statics/config/config'
export default {
  name: 'MyLayout',
  mounted() {
    this.language = window.navigator.language.toLowerCase()
    this.getBuildNO().then(res => {
      this.buildNo = res
    })
  },
  data() {
    return {
      language: null,
      buildNo: null,
    }
  },
  computed: {
    ...mapState('master', ['leftDrawerOpen']),
    revision() {
      // const { VERSION, COMMITHASH, BRANCH, BUILDNUMBER } = process.env || {}
      // console.debug(process.env)
      // return `${process.env.VERSION} Build ${process.env.COMMITHASH} Branch ${process.env.BRANCH}`
      // this.version || ''
      const p = (process.env.VERSION && process.env.VERSION.indexOf('-')) || 0
      const v =
        (process.env.VERSION && `Version: ${process.env.VERSION.substr(0, p > 0 ? p : process.env.VERSION.length)} `) ||
        ''
      const c = (process.env.COMMITHASH && `Commit: ${process.env.COMMITHASH} `) || ''
      const b =
        (process.env.BUILDNUMBER && `BuildNo.: ${process.env.BUILDNUMBER} `) ||
        (this.buildNo && `BuildNo.: ${this.buildNo} `) ||
        (process.env.BRANCH && `Branch: ${process.env.BRANCH} `) ||
        ''
      return `${v}${c}${b}`
    },
  },
  methods: {
    ...mapMutations('master', ['setLeftDrawerOpen']),
    ...mapActions('master', ['getBuildNO']),
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
