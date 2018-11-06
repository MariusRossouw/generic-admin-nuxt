<template>
  <div class="uk-container uk-container-large">
    <div
      id="accounts_abalobi"
      uk-grid>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default card_profile" >
          <div class="uk-card-header ">
            <h2>Add bank account</h2>
          </div>
          <div class="uk-card-body " >
            <div uk-grid>
              <div class="uk-width-1-2">
                <label
                  class="uk-form-label"
                  style="margin-bottom: 15px">Account Name</label>
                <input
                  v-model="account.account_name"
                  class="uk-input uk-form-width-medium" >
              </div>
              <div class="uk-width-1-2">
                <label
                  class="uk-form-label"
                  style="margin-bottom: 15px">Account Number</label>
                <input
                  v-model="account.account_no"
                  class="uk-input uk-form-width-medium" >
              </div>
              <div class="uk-width-1-2">
                <div class="uk-margin" >
                  <label
                    class="uk-form-label"
                    style="margin-bottom: 15px">Bank</label><br>
                  <select
                    v-model="account.branch_no"
                    class="uk-select uk-form-width-medium">
                    <option
                      v-for="bank in bank_list"
                      :value="bank.default_branch_code"
                      :key="bank.default_branch_code">
                      {{ bank.bank_name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <p>{{ result_message }}</p>
            <button
              class="uk-button uk-button-default uk-button-small"
              style="margin: 5px 0"
              @click="submit()">Submit</button><br>
            <button
              class="uk-button uk-button-default uk-button-small button-back"
              style="margin: 5px 0"
              @click="back()">Back</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {
    axios
  },
  data() {
    return {
      bank_list: [],
      result_message: "",
      account: {}
    };
  },
  beforeMount() {
    if (
      !this.$store.state ||
      !this.$store.state.session ||
      !this.$store.state.session.authed
    ) {
      this.$router.push("/");
    }
  },
  mounted() {
    this.init_bank_list();
  },
  methods: {
    back() {
      this.$router.push("/beneficiaries");
    },
    init_bank_list() {
      var _this = this;
      let request = {
        id: this.$route.params.id
      };
      console.log(request);
      axios
        .post(this.$store.state.api_url + "/bank_list", request)
        .then(response => {
          _this.bank_list = response.data.data;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    submit: function() {
      if (!this.account.branch_no) {
        alert("Please select a bank");
        return;
      }
      if (this.account.account_name.length == 0) {
        alert("Please enter an account name");
        return;
      }
      if (this.account.account_no.length == 0) {
        alert("Please enter a bank account number");
        return;
      }
      this.result_message = "-- processing --";
      this.submitted = true;
      var _this = this;
      var payload = this.account;
      payload.profile_id = 0;
      axios
        .post(this.$store.state.api_url + "/beneficiary_add", payload)
        .then(function(response) {
          if (response.data.http_code != "200") {
            if (response.data.err_message) {
              _this.result_message = response.data.err_message;
            } else {
              _this.result_message = "End point error";
            }
          } else {
            this.$router.push("/beneficiaries");
          }
        });
    }
  }
};
</script>
