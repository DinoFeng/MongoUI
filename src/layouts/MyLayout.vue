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
        div Quasar v{{ $q.version }}
    q-footer
      q-toolbar
        q-toolbar-title Footer
    //- q-page-container
    router-view
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'MyLayout',

  data() {
    return {}
  },
  computed: {
    ...mapState('master', ['leftDrawerOpen']),
  },
  methods: {
    ...mapMutations('master', ['setLeftDrawerOpen']),
  },
}
</script>
