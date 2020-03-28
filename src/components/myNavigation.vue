<template lang="pug">

    q-breadcrumbs
      q-breadcrumbs-el(
        v-if='!!navigation.server'
        :label='navigation.server' 
        :to='`/app/${navigation.server}`'
        icon='fas fa-desktop' 
        exact
        )
      q-breadcrumbs-el(
        v-if='!!navigation.db'
        :label='navigation.db' 
        :to='`/app/${navigation.server}/${navigation.db}`'
        icon='fas fa-database' 
        exact
        )
      q-breadcrumbs-el(
        v-if='!!navigation.table'
        :label='navigation.table' 
        icon='fas fa-table'
        exact
        )
      
</template>

<script>
import _ from 'lodash'
export default {
  name: 'myNavigation',
  computed: {
    navigation() {
      return _.get(this.$route, ['params'])
    },
  },
}
</script>
