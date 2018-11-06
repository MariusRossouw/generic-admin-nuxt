<template>
  <nav>
    <ul class="uk-nav uk-nav-default">
      <li><nuxt-link to="/dashboard">Homepage</nuxt-link></li>
      <li>
        <ul uk-accordion>
          <li>
            <a
              class="uk-accordion-title"
              href="#">Dropdown Menu</a>
            <div class="uk-accordion-content">
              <li><nuxt-link to="#">Link One</nuxt-link></li>
              <li><nuxt-link to="#">Link Two</nuxt-link></li>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "DashboardSideNav",
  beforeMount() {
    this.checkAuthState();
  },
  methods: {
    checkAuthState() {
      let ls = JSON.parse(localStorage.getItem("Generic"));
      if (!ls) {
        this.$router.push("/login");
      } else {
        this.$store.replaceState(ls);
      }
    }
  }
};
</script>
