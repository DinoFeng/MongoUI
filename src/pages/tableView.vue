<template lang="pug">
  q-page.flex.flex-center
    span AAA
    img(
      alt='Quasar logo'
      src='~assets/quasar-logo-full.svg'
      )
</template>

<script>
import consola from 'consola'
export default {
  name: 'TableView',
  // preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
  //   // fetch data, validate route and optionally redirect to some other route...

  //   // ssrContext is available only server-side in SSR mode

  //   // No access to "this" here as preFetch() is called before
  //   // the component gets instantiated.

  //   // Return a Promise if you are running an async job
  //   // Example:
  //   // return store.dispatch('fetchItem', currentRoute.params.id)
  //   consola.info({ currentRoute, previousRoute })
  // },
  mounted() {
    consola.info(this.$route)
  },
}
</script>
