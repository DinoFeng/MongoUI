<template>
  <div class="container">
    <div>
      <logo />
      <span>{{ $route.params }}</span>
      <span>{{ $route.path }}</span>
      <span>{{ $route.name }}</span>
    </div>
  </div>
</template>

<script>
import consola from 'consola'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  validate({ params }) {
    consola.log({ params })
    return false
  },
  asyncData(context) {
    try {
      consola.log({ context })
    } catch (e) {
      context.error({ message: 'User not found', statusCode: 404 })
    }
  },
  created() {
    consola.log(this.$route)
  }
}
</script>
