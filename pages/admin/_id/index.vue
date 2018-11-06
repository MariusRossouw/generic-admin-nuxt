<template>
  <div
    class="uk-container uk-container-large"
    style="margin-top: 40px">
    <div uk-grid>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default card_profile-info">
          <div class="uk-card-body">
            <div uk-grid>
              <div class="uk-width-1-3">
                <div class="img_wrap">
                  <img :src="profileinfo.photo" >
                </div>
                <h4>{{ profileinfo.first_name }} {{ profileinfo.last_name }}</h4>
              </div>
              <div class="uk-width-1-3">
                <ul>
                  <li><strong>Mobile</strong></li>
                  <li>
                    <p>{{ profileinfo.mobile_no }}</p>
                  </li>
                  <li><strong>Email</strong></li>
                  <li>
                    <p>{{ profileinfo.email }}</p>
                  </li>
                </ul>
              </div>
              <div class="uk-width-1-3">
                <p>&nbsp;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default ">
          <div class="uk-card-header ">
            <h4>Profile</h4>
          </div>
          <div class="uk-card-body">
            <div uk-grid>
              <div class="uk-width-1-2">
                <div uk-grid>
                  <div class=" uk-flex uk-flex-left ">
                    <div
                      class="uk-width-1-3  "
                      style="font-weight:bold;">First name:</div>
                    <div class="uk-width-2-3  uk-form-controls ">
                      <input
                        v-model="profile.first_name"
                        style="border: 1px solid black; border-collapse: collapse"
                        placeholder="first name"
                        class="uk-input uk-form-width-large"
                        type="text">
                    </div>
                  </div>
                </div>
                <div uk-grid>
                  <div class=" uk-flex uk-flex-left ">
                    <div
                      class="uk-width-1-3  "
                      style="font-weight:bold;">Last Name:</div>
                    <div class="uk-width-2-3  uk-form-controls ">
                      <input
                        v-model="profile.last_name"
                        style="border: 1px solid black; border-collapse: collapse"
                        placeholder="last name"
                        class="uk-input uk-form-width-large"
                        type="text">
                    </div>
                  </div>
                </div>
              </div>
              <div class="uk-width-1-2">
                <div uk-grid>
                  <div class=" uk-flex uk-flex-left ">
                    <div
                      class="uk-width-1-3  "
                      style="font-weight:bold;">Email:</div>
                    <div class="uk-width-2-3  uk-form-controls ">
                      <input
                        v-model="profile.email"
                        style="border: 1px solid black; border-collapse: collapse"
                        placeholder="email"
                        class="uk-input uk-form-width-large"
                        type="text">
                    </div>
                  </div>
                </div>
                <div uk-grid>
                  <div class=" uk-flex uk-flex-left ">
                    <div
                      class="uk-width-1-3  "
                      style="font-weight:bold;">Mobile:</div>
                    <div class="uk-width-2-3  uk-form-controls ">
                      <input
                        v-model="profile.mobile_no"
                        style="border: 1px solid black; border-collapse: collapse"
                        placeholder="contact number"
                        class="uk-input uk-form-width-large"
                        type="text">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="uk-card-footer uk-text-right ">
            <button
              type="button"
              class="uk-button uk-button-primary"
              @click="profile_admin_update_data(profile,$event)">
              Update
            </button>
          </div>
        </div>
      </div>

      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default ">
          <div class="uk-card-header ">
            <h4>Password</h4>
          </div>
          <div class="uk-card-body">
            <div uk-grid>
              <div class="uk-width-1-2">
                <div uk-grid>
                  <div class=" uk-flex uk-flex-left ">
                    <div
                      class="uk-width-1-3  "
                      style="font-weight:bold;">Password:</div>
                    <div class="uk-width-2-3  uk-form-controls ">
                      <input
                        v-model="profile.password"
                        style="border: 1px solid black; border-collapse: collapse"
                        placeholder="password"
                        class="uk-input uk-form-width-large"
                        type="password">
                    </div>
                  </div>
                </div>
              </div>
              <div class="uk-width-1-2">
                <div uk-grid>
                  <div class=" uk-flex uk-flex-left ">
                    <div
                      class="uk-width-1-3  "
                      style="font-weight:bold;">Confirm Password:</div>
                    <div class="uk-width-2-3  uk-form-controls ">
                      <input
                        v-model="profile.password_confirm"
                        style="border: 1px solid black; border-collapse: collapse"
                        placeholder="password"
                        class="uk-input uk-form-width-large"
                        type="password">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="uk-card-footer uk-text-right ">
            <button
              type="button"
              class="uk-button uk-button-primary"
              @click="profile_admin_update_password">
              Update
            </button>
          </div>
        </div>
      </div>

      <p>&nbsp;</p>

    </div>
  </div>
</template>


<script>
import { AgGridVue } from "ag-grid-vue";
import axios from "axios";
export default {
  components: {
    "ag-grid-vue": AgGridVue,
    axios: axios
  },
  data() {
    return {
      filter: {},
      loading: false,
      rowData: [],
      profile: {
        jdata: {}
      },
      profileinfo: {}
    };
  },
  beforeMount() {
    // this.checkAuthState();
    if (
      !this.$store.state ||
      !this.$store.state.session ||
      !this.$store.state.session.authed
    ) {
      this.$router.push("/");
    }
  },
  mounted() {
    this.profile_fetch_detail();
  },
  methods: {
    profile_fetch_detail() {
      let request = {
        id: this.$route.params.id
      };
      console.log(request);
      axios
        .post(this.$store.state.api_url + "/profile_read", request)
        .then(response => {
          var profile = response.data.data;
          profile.photo = "/avatar.png"; //this.$store.state.api_url + "/avatar.png";
          if (!profile.import_data) {
            profile.import_data = {};
          }
          if (profile.import_data && profile.import_data.image_url) {
            profile.photo = profile.import_data.image_url;
          }
          profile.password = "";
          this.profile = profile;
          this.profileinfo = JSON.parse(JSON.stringify(profile));
        })
        .catch(error => {
          console.log(error.response);
        });
    },

    profile_admin_update_data(profile, event) {
      console.log("profile_admin_update_data clicked", profile);
      console.log("profile_admin_update_data clicked", event);
      let contact_number_reqex = /(^\+?([1-9]{1,2})[0-9]{9}$|^0[0-9]{9}$)/;
      let email_regex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (typeof this.profile.mobile_no === "string") {
        if (!contact_number_reqex.test(this.profile.mobile_no)) {
          alert("Contact number format should be +12345678910 or 0123456789");
          return;
        }
      }
      if (typeof this.profile.email === "string") {
        if (!email_regex.test(this.profile.email)) {
          alert("Email format should be name@example.com");
          return;
        }
      }

      let payload = {
        id: this.$route.params.id,
        first_name: this.profile.first_name,
        last_name: this.profile.last_name,
        email: this.profile.email,
        mobile_no: this.profile.mobile_no
      };
      axios
        .post(this.$store.state.api_url + "/profile_update_admin", payload)
        .then(() => {
          alert(`The profile's details was updated`);
        });
    },
    profile_admin_update_password: function() {
      if (!this.profile.password || this.profile.password.length == 0) {
        alert("Password required");
        return;
      }
      if (this.profile.password.length < 7) {
        alert("Password must at least be 7 characters long");
        return;
      }
      if (
        !this.profile.password_confirm ||
        this.profile.password_confirm.length == 0
      ) {
        alert("Confirm password required");
        return;
      }
      let password_regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
      if (!password_regex.test(this.profile.password)) {
        alert("Password needs at least one capital and one numeric symbol");
        return;
      }
      if (this.profile.password !== this.profile.password_confirm) {
        alert("Passwords do not match");
        return;
      }
      let payload = {
        id: this.$route.params.id,
        password: this.profile.password
      };
      axios
        .post(this.$store.state.api_url + "/profile_update_admin", payload)
        .then(() => {
          alert("The password was updated");
          this.profile.password = null;
          this.profile.password_confirm = null;
        });
    },
    rand_formatter(params) {
      let v = "0.00";
      if (params.value) {
        //v = "R" + Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,");
        v =
          "R " +
          Number(params.value)
            .toFixed(2)
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
      return v;
    },
    count_formatter(params) {
      let res = "";
      if (params.value != 0) {
        res = params.value;
      }
      return res;
    }
  }
};
</script>

<style>
.img_wrap {
  height: 125px;
  width: 125px;
  overflow: hidden;
  /* margin: 0 auto; */
  margin-left: 200px;
  border: 5px solid #284f7b;
  border-radius: 50%;
}

.img_wrap img {
  max-width: 100%;
  height: auto;
}

.img_wrap + h4 {
  color: #004a85;
  font-weight: 600;
}
</style>
