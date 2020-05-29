<template>
  <div></div>
</template>
<script>
import Oidc from 'oidc-client'

export default {
  methods: {
  },
  mounted: function () {
    new Oidc.UserManager({ response_mode: 'query' })
      .signinSilentCallback()
      .then(() => {
        // this.$router.go(-1)
      })
      .catch(function (e) {
        console.error(e)
      })
  }
}
</script>
