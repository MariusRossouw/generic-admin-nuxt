<template>
  <div>
    <nav
      class="uk-navbar-container"
      uk-navbar>
      <div class="uk-navbar-nav">
        <div class="uk-logo">
          <img
            src="@/assets/logo.svg"
            class="logo-image"
            @click="goHome()">
        </div>
        <div class="nav-toggle">
          <a
            href="#offcanvas-slide-flip"
            class="uk-button uk-button-default"
            uk-toggle><span uk-icon="icon:  menu"/></a>
          <div
            id="offcanvas-slide-flip"
            uk-offcanvas="flip: true; overlay: true">
            <div class="uk-offcanvas-bar">
              <a
                href="#offcanvas-slide-flip"
                class="uk-button uk-button-default toggle_close"
                style="float:right"
                uk-toggle><span uk-icon="icon:  close"/></a>
              <ul class="uk-nav uk-nav-default">
                <li
                  v-for="route in $store.state.session.navbar"
                  :key="route.to"
                  exact><nuxt-link :to="route.to">{{ route.label }}</nuxt-link></li>
                <li
                  v-if="!$store.state.session.authed"
                  exact><a @click="login()"> Login</a></li>
                <li
                  v-if="$store.state.session.authed"
                  exact><a @click="logout()"> Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push("/");
    },
    logout() {
      this.$store.commit("clear");
      localStorage.setItem(
        "Generic",
        JSON.stringify(this.$store.state.session)
      );
      this.$router.push("/");
    },
    login() {
      this.$router.push("/");
    }
  }
};
</script>

<style>
.nav-toggle {
  position: absolute;
  right: 25px;
  top: 25px;
}

a.uk-button.uk-button-default {
  background-color: #0d4162;
  border-radius: 0;
  padding: 0px 10px;
}

a.uk-button.uk-button-default.toggle_close {
  background: white;
  top: 10px;
  right: 10px;
  position: absolute;
}

a.uk-button.uk-button-default.toggle_close span svg path {
  stroke: #0d4162;
}

.uk-offcanvas-bar.uk-offcanvas-bar-animation.uk-offcanvas-slide {
  background-color: white;
}

.uk-offcanvas-bar .uk-nav-default > li > a {
  color: black;
}

.uk-offcanvas-bar .uk-nav-default > li > a:hover {
  color: black;
}

.uk-offcanvas-bar
  .uk-nav-default
  > li
  > a.nuxt-link-exact-active.nuxt-link-active {
  color: #0d4162;
  font-weight: bold;
}
</style>
