<template>
  <div
    class="uk-container uk-container-large"
    style="margin-top: 40px">
    <div
      id="account_list_edit"
      uk-grid>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default card_profile-info"> <!-- card_profile -->
          <div class="uk-card-body">
            <div uk-grid>
              <div class="uk-width-1-3">
                <div class="img_wrap">
                  <img :src="profile.photo" >
                </div>
                <h4>{{ profile.first_name }} {{ profile.last_name }}</h4>
              </div>
              <div class="uk-width-1-3">
                <ul>
                  <li><strong>Mobile</strong></li>
                  <li>
                    <p>{{ profile.mobile_no }}</p>
                  </li>
                  <li><strong>Email</strong></li>
                  <li>
                    <p>{{ profile.email }}</p>
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
            <h4>Rand Account {{ account.account_no }}</h4>
          </div>
          <div class="uk-card-body card_no_pad">
            <AgGridVue
              ref="table"
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              :rowData="rowData"
              style="height: 25vh"
              class="ag-theme-balham"/>
          </div>
          <div class="uk-card-footer footer-total">
            <p>Total Balance: <b>{{ account.balance_formatted }}</b></p>
          </div>
        </div>
      </div>
      <div class="uk-width-1-2">
        <div class="uk-card uk-card-default">
          <div class="uk-card-header ">
            <h4>Options</h4>
          </div>
          <div class="uk-card-body">
            <button
              class="uk-button uk-button-default"
              @click="profile_fetch_data()">Refresh</button>
          </div>
        </div>
      </div>
    </div>
    <transaction-modal/>
    <br>
    <br>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import axios from "axios";
import transactionModal from "@/components/modals/transaction";
export default {
  components: {
    AgGridVue,
    axios,
    "transaction-modal": transactionModal
  },
  data() {
    return {
      loading: false,
      profile: {
        import_data: {}
      },
      profile_update_result: "",
      account: {},
      rowData: [],
      account_savings: {},
      rowDataSavings: [],
      eft_request: {
        amount: 0,
        message: ""
      },
      eft_request_result: "",
      columnDefs: [
        {
          field: "tx_time",
          headerName: "Date",
          width: 120
        },
        {
          field: "reference",
          headerName: "Reference",
          width: 150
        },
        {
          field: "amount",
          headerName: "Amount",
          width: 100,
          valueFormatter: this.rand_formatter,
          cellStyle: {
            textAlign: "right"
          }
        },
        {
          headerName: "",
          field: "",
          editable: true,
          cellRenderer: this.infoCellRenderer,
          onCellClicked: this.openTX,
          width: 80
        }
      ],

      gridOptions: {
        defaultColDef: {
          // allow every column to be aggregated
          enableValue: true,
          // allow every column to be grouped
          enableRowGroup: true,
          // allow every column to be pivoted
          enablePivot: true
        },
        suppressPropertyNamesCheck: true,
        enableColResize: true,
        // floatingFilter: true,
        enableSorting: true,
        enableFilter: true,
        enableColResize: true,
        rowSelection: "single",
        rowHeight: 50,
        onGridReady: function(params) {
          params.api.sizeColumnsToFit();
        }
      },
      columnDefsSavings: [
        {
          field: "tx_time",
          headerName: "Date",
          width: 120
        },
        {
          field: "reference",
          headerName: "Reference",
          width: 150
        },
        {
          field: "amount",
          headerName: "Amount",
          width: 100,
          valueFormatter: this.oz_formatter,
          cellStyle: {
            textAlign: "right"
          }
        },
        {
          headerName: "",
          field: "",
          editable: true,
          cellRenderer: this.infoCellRenderer,
          onCellClicked: this.openTX,
          width: 80
        }
      ],

      gridOptionsSavings: {
        defaultColDef: {
          // allow every column to be aggregated
          enableValue: true,
          // allow every column to be grouped
          enableRowGroup: true,
          // allow every column to be pivoted
          enablePivot: true
        },
        suppressPropertyNamesCheck: true,
        enableColResize: true,
        // floatingFilter: true,
        enableSorting: true,
        enableFilter: true,
        enableColResize: true,
        rowSelection: "single",
        rowHeight: 50,
        onGridReady: function(params) {
          params.api.sizeColumnsToFit();
        }
      }
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
    this.profile_fetch_data();
  },
  methods: {
    validateNumber(n) {
      var r = {
        valid: false,
        value: 0,
        orig: "null"
      };
      r.orig = "" + n;
      r.orig = r.orig.split(",").join("");
      try {
        r.value = parseFloat(r.orig);
        r.valid = true;
      } catch (err) {
        r.value = 0;
        r.valid = false;
        return r;
      }
      if (r.value === 0) {
        return r;
      }
      if (!r.value) {
        r.value = 0;
        r.valid = false;
        return r;
      }
      return r;
    },
    submit_eft_request() {
      var r = this.validateNumber(this.eft_request.amount);

      if (!r.valid) {
        alert("Invalid amount");
        return true;
      }

      if (r.value <= 0) {
        alert("Invalid amount");
        return true;
      }

      if (!this.eft_request.message || this.eft_request.message.length == 0) {
        alert("Please provide a message");
        return true;
      }

      var v = {};
      v.amount = this.eft_request.amount;
      v.message = this.eft_request.message;
      v.id = this.profile.account_id;

      let request = {
        accounts: [v]
      };
      axios
        .post(this.$store.state.api_url + "/account_eft_out", request)
        .then(response => {
          if (response.data.http_code != "200") {
            if (response.data.err_message) {
              _this.eft_request_result = response.data.err_message;
            } else {
              _this.eft_request_result = "End point error";
            }
          } else {
            alert("Request processed successfully");
            this.profile_fetch_data();
            this.eft_request = {
              amount: 0,
              message: ""
            };
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    },

    infoCellRenderer() {
      return '<div class="btn__blue">VIEW</div>';
    },
    openTX(params) {
      this.$modal.show("transaction-modal", {
        params
      });
    },
    back() {
      this.$router.push("/profile/list");
    },
    checkboxCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>ⓘ</b></h3></div>';
    },
    openAccount(params) {
      this.$router.push("/account/" + params.data.id);
    },
    profile_fetch_data() {
      let request = {
        id: this.$route.params.id
      };
      axios
        .post(this.$store.state.api_url + "/profile_read", request)
        .then(response => {
          this.profile = response.data.data;
          this.profile.photo = "/avatar.png";
          if (!this.profile.import_data) {
            this.profile.import_data = {};
          }

          if (this.profile && this.profile.account_id) {
            this.account_fetch_data(this.profile.account_id, "wallet");
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    account_fetch_data(account_id, type) {
      var _this = this;
      let request = {
        id: account_id
      };
      axios
        .post(this.$store.state.api_url + "/account_item", request)
        .then(response => {
          var resp = response.data.data;
          resp.balance_formatted = this.rand_formatter2(resp.balance);
          if (!resp.transactions) {
            resp.transactions = [];
          }
          for (var i = 0; i < resp.transactions.length; i++) {
            var r = resp.transactions[i];
            r.tx_time = r.create_time.substr(0, 10);
          }
          if (type == "wallet") {
            _this.account = resp;
            _this.rowData = resp.transactions;
          }
          if (type == "savings") {
            _this.account_savings = resp;
            _this.rowDataSavings = resp.transactions;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    profile_update_data: function() {
      if (isNaN(this.profile.comission)) {
        alert("Commission must be a number");
        return;
      }
      var _this = this;
      var payload = {};
      payload.id = this.profile.id;
      payload.comission = parseFloat(this.profile.comission);
      payload.commission_yn = this.profile.commission_yn;
      payload.saving_percentage = parseFloat(this.profile.saving_percentage);
      payload.saving_yn = this.profile.saving_yn;
      axios
        .post(this.$store.state.api_url + "/profile_update", payload)
        .then(function(response) {
          if (response.data.http_code != "200") {
            if (response.data.err_message) {
              _this.profile_update_result = response.data.err_message;
            } else {
              _this.profile_update_result = "End point error";
            }
          } else {
            alert("Update processed successfully");
            _this.profile_fetch_data();
          }
        });
    },
    doRandom() {
      const that = this;
      that.loading = !that.loading;
    },
    rand_formatter(params) {
      var v = "0.00";
      if (params.value) {
        v =
          "R " +
          Number(params.value)
            .toFixed(2)
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
      return v;
    },
    oz_formatter(params) {
      var v = "0.00";
      if (params.value) {
        v = "OZ " + Number(params.value).toFixed(6);
      }
      return v;
    },
    rand_formatter2(amount) {
      return (
        "R " + amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      );
    },
    count_formattern(params) {
      var res = "";
      if (params.value != 0) {
        res = params.value;
      }
      return res;
    }
  }
};
</script>
