<template>
  <!-- <nav class="uk-navbar-container" uk-navbar>

                    <div class="uk-navbar-left">
                    <div class="uk-logo">

                    </div>
                    </div>
                    <div class="uk-navbar-right">
                    <ul class="uk-navbar-nav">
                                    <li v-for="route in $store.state.session.navbar" :key="route.to" exact><nuxt-link v-bind:to="route.to">{{route.label}}</nuxt-link></li>
                                    <li v-if="!$store.state.session.authed" exact><a @click="login()"> Login</a></li>
                                    <li v-if="$store.state.session.authed" exact><a @click="logout()"> Logout</a></li>
                                </ul>
                    </div>


            </nav> -->
  <div class="nav_wrap">
    <div class="uk-container uk-container-large">
      <nav
        class="uk-navbar-container"
        uk-navbar>


        <div class="uk-navbar-left">

          <img
            src="@/assets/mp_logo.png"
            class="logo-image"
            @click="goHome()" >

        </div>

        <div class="uk-navbar-right">

          <ul class="uk-navbar-nav">
            <!-- <li v-for="route in $store.state.session.navbar" :key="route.to" exact>
                    <nuxt-link v-bind:to="route.to">{{route.label}}</nuxt-link>
                </li> -->

            <li v-if="$store.state.session.authed"><nuxt-link to="/dashboard">Dashboard</nuxt-link>
            </li><li v-if="$store.state.session.authed"><nuxt-link to="/profile/list">Clients</nuxt-link>
            </li><li v-if="$store.state.session.authed"><nuxt-link to="/claims">Claims</nuxt-link></li>
            <!-- <li v-if="$store.state.session.authed"><nuxt-link to="/listings">Listings</nuxt-link></li> -->
            <!-- <li v-if="$store.state.session.authed"><nuxt-link to="/accountseft_v2">EFT Payouts</nuxt-link></li> -->
            <!-- <li v-if="$store.state.session.authed"><nuxt-link to="/accountseftlog">EFT Log</nuxt-link></li> -->

            <!-- <li v-if="$store.state.session.authed"><nuxt-link to="/accountseft">EFT Payouts</nuxt-link></li> -->
            <!-- <li v-if="$store.state.session.authed"><nuxt-link to="/accountseftlog">EFT Log</nuxt-link></li> -->

            <li v-if="$store.state.session.authed">
              <nuxt-link
                :to="{path : '/bankaccount'}"
                routerLinkActive>Bank Accounts</nuxt-link>
              <div class="uk-navbar-dropdown">
                <ul class="uk-nav uk-navbar-dropdown-nav">
                  <li ><nuxt-link :to="{path : '/bankaccount'}">Bank Account</nuxt-link></li>
                  <li ><nuxt-link :to="{path : '/statement'}">Bank Statement</nuxt-link></li>
                  <li ><nuxt-link :to="{path : '/account/list'}">System Accounts</nuxt-link></li>
                  <li ><nuxt-link :to="{path : '/beneficiaries'}">Beneficiaries</nuxt-link></li>
                </ul>
              </div>
            </li>
            <li v-if="$store.state.session.authed"><nuxt-link to="/account_eft">EFT Payout</nuxt-link></li>
            <li v-if="$store.state.session.authed"><nuxt-link :to="{path : '/reports'}">Reports</nuxt-link></li>
            <li v-if="$store.state.session.authed"><nuxt-link :to="{path : '/admin/list'}">Admins</nuxt-link></li>
            <!-- class="uk-active" -->
            <li
              v-if="$store.state.session.authed"
              exact><a
                class="login"
                @click="logout()"> Logout</a></li>
            <li
              v-if="!$store.state.session.authed"
              exact><a
                class="login"
                @click="login()"> Login</a></li>
          </ul>

        </div>


      </nav>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.state.session = {
        navbar: [],
        authed: false
      };
      localStorage.setItem(
        "Generic",
        JSON.stringify(this.$store.state.session)
      );
      this.$router.push("/");
    },
    login() {
      this.$router.push("/");
    },
    goHome() {
      this.$router.push("/dashboard");
    }
  }
};
</script>


<style lang="scss">
.nav_wrap {
  background-color: white;
  -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);

  margin-bottom: 25px;

  img.logo-image {
    height: auto;
    margin: 0 auto;
    max-width: 250px;
  }

  nav.uk-navbar-container.uk-navbar {
    background: white;

    ul.uk-navbar-nav {
      li {
        margin: 0 10px;

        a {
          text-transform: capitalize;
          font-size: 15px;
          color: #393c40;

          @media (max-width: 1300px) {
            font-size: 12px;
            padding: 0;
          }
        }

        a.nuxt-link-exact-active.nuxt-link-active {
          color: #4b69ff;
          font-weight: bold;

          &:after {
            content: " ";
            height: 5px;
            background-color: #4b69ff;
            display: inline-block;
            position: absolute;
            bottom: 0;
            width: 100px;
          }
        }

        a.login {
          height: 40px !important;
          margin: 20px auto;
          padding: 10px 25px !important;
          border-radius: 25px;
          border: 1px solid #393c40;

          &:hover {
            background-color: #064c83;
            border: 1px solid #064c83;
            color: white;
            transition: 0.3s;
          }
        }
      }
    }
  }
}
</style>
