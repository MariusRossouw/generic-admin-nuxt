<template>
  <div class="uk-container">
    <div uk-grid>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default card-login">
          <div class="uk-card-header">
            <span uk-icon="icon: user; ratio: 3.5"/>
          </div>
          <div class="uk-card-body">
            <div class="uk-position-relative">
              <span
                class="uk-form-icon"
                uk-icon="icon: mail"/>
              <input
                v-model="email"
                class="uk-input"
                type="text"
                placeholder="Email">
            </div>
            <br>
            <div class="uk-position-relative">
              <span
                class="uk-form-icon"
                uk-icon="icon: lock"/>
              <input
                v-model="password"
                class="uk-input"
                type="password"
                placeholder="Password">
            </div>
          </div>
          <div class="uk-card-footer">
            <button
              class="uk-button uk-button-default"
              @click="loginButton()">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  layout: "login_layout",
  components: {
    axios: axios
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  beforeMount() {
    this.$store.commit("clear");
    localStorage.setItem("Generic", JSON.stringify(this.$store.state.session));
  },
  methods: {
    loginButton() {
      let request = {
        auth_identifier: this.email,
        auth_password: this.password
      };
      axios
        .post(this.$store.state.api_url + "/profile_login", request)
        .then(response => {
          // Add entity to session in vuex
          this.$store.state.session.entity = response.data.data;
          this.$store.state.session.authed = true;
          this.$store.state.session.navbar = [
            { to: "/dashboard", label: "Dashboard" },
            { to: "/profile/list", label: "Fisher Profiles" },
            { to: "/listings", label: "Listings" },
            { to: "/accountseft_v2", label: "EFT Payouts" },
            { to: "/accountseftlog", label: "EFT Log" },
            { to: "/account/list", label: "System Accounts" },
            { to: "/reports", label: "Reports" },
            { to: "/statement", label: "Statement" },
            { to: "/settings", label: "Settings" }
          ];
          localStorage.setItem("Generic", JSON.stringify(this.$store.state));
          this.$router.push("/dashboard");
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>

<style>
.uk-card-footer button.uk-button.uk-button-default {
  float: right;
}
</style>
