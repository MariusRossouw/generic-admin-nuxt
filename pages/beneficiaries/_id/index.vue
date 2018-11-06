<template>
  <div class="uk-container uk-container-large">
    <div
      id="accounts_abalobi"
      uk-grid>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default card_profile" >
          <div class="uk-card-header ">
            <h2>Beneficiary</h2>
          </div>
          <div class="uk-card-body " >
            <p>Account Name: {{ account.account_name }}<br>
              Bank Name: {{ account.account_name }}<br>
              Branch Code: {{ account.branch_no }}</p>
            <button
              class="uk-button uk-button-default uk-button-small"
              style="margin: 5px 0"
              @click="edit()">Edit</button><br>
            <button
              class="uk-button uk-button-default uk-button-small button-back"
              style="margin: 5px 0"
              @click="back()">Back</button>
          </div>
        </div>
        <br>
        <div class="uk-card uk-card-default card_profile" >
          <div class="uk-card-header ">
            <h2>Payment Option</h2>
          </div>
          <div class="uk-card-body " >
            <div uk-grid>
              <div class="uk-width-1-2">
                <div class="uk-margin" >
                  <label
                    class="uk-form-label"
                    style="margin-bottom: 15px">From Account</label><br>
                  <select
                    v-model="selected_option"
                    class="uk-select uk-form-width-medium">
                    <option
                      v-for="o in options"
                      :value="o.id"
                      :key="o.id">
                      {{ o.system_name }} {{ o.account_no }} {{ rand_formatter2(o.balance) }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="uk-width-1-2">
                <label
                  class="uk-form-label"
                  style="margin-bottom: 15px">My Reference</label>
                <input
                  v-model="my_reference"
                  class="uk-input uk-form-width-medium"
                  type="text" >
              </div>
              <div class="uk-width-1-2">
                <label
                  class="uk-form-label"
                  style="margin-bottom: 15px">Amount</label>
                <input
                  v-model.number.lazy="amount"
                  class="uk-input uk-form-width-medium"
                  type="text" >
              </div>
              <div class="uk-width-1-2">
                <label
                  class="uk-form-label"
                  style="margin-bottom: 15px">Other Reference</label>
                <input
                  v-model="other_reference"
                  class="uk-input uk-form-width-medium"
                  type="text" >
              </div>
            </div>
            <p>{{ result_message }}</p>
            <button
              class="uk-button uk-button-default uk-button-small"
              style="margin: 5px 0"
              @click="submit()">Submit</button><br>
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
      result_message: "",
      account: {},
      amount: 0,
      selected_option: 0,
      my_reference: "",
      other_reference: "",
      options: []
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
    this.init_fetch_data();
    this.init_fetch_options();
  },
  methods: {
    back() {
      this.$router.push("/beneficiaries");
    },
    edit() {
      this.$router.push("/beneficiaries/" + this.$route.params.id + "/edit");
    },
    rand_formatter2(value) {
      var v = "0.00";
      if (value) {
        v =
          "R " +
          Number(value)
            .toFixed(2)
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
      return v;
    },
    init_fetch_data() {
      var _this = this;
      let request = {
        id: this.$route.params.id
      };
      axios
        .post(this.$store.state.api_url + "/beneficiary_read", request)
        .then(response => {
          _this.account = response.data.data;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    init_fetch_options() {
      var _this = this;
      let request = {
        id: this.$route.params.id
      };
      console.log(request);
      axios
        .post(this.$store.state.api_url + "/beneficiary_pay_options", request)
        .then(response => {
          _this.options = response.data.data;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    submit: function() {
      if (this.amount == 0) {
        alert("Please select an account");
        return;
      }
      if (this.amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      if (this.my_reference.length == 0) {
        alert("Please enter my reference");
        return;
      }
      if (this.other_reference.length == 0) {
        alert("Please enter other reference");
        return;
      }
      this.result_message = "-- processing --";
      this.submitted = true;
      var _this = this;
      var payload = {};
      payload.id = this.$route.params.id;
      payload.from_account_id = this.selected_option;
      payload.amount = this.amount;
      payload.my_reference = this.my_reference;
      payload.other_reference = this.other_reference;
      axios
        .post(this.$store.state.api_url + "/beneficiary_pay", payload)
        .then(function(response) {
          if (response.data.http_code != "200") {
            if (response.data.err_message) {
              _this.result_message = response.data.err_message;
            } else {
              _this.result_message = "End point error";
            }
          } else {
            _this.result_message = response.data.message;
            _this.$router.push("/beneficiaries");
          }
        });
    }
  }
};
</script>
