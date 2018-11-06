<template>
  <nav
    class="uk-navbar-container"
    uk-navbar>
    <div class="uk-logo">
      <img
        src="@/assets/logo.svg"
        class="logo-image"
        @click="goHome()">
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    login() {
      this.$router.push("/login");
    }
  }
};
</script>
