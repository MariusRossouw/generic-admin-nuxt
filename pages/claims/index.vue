<template>
  <div class="uk-container uk-container-large">
    <div
      id="accounts_abalobi"
      uk-grid>
      <div class="uk-width-1-1">
        <div
          class="uk-card uk-card-default "
          style="margin: 20px">
          <div class="uk-card-header ">
            <h2>Claims</h2>
            <div style="float: right;">
              <button
                class="uk-button uk-button-default"
                @click="grid_fetch_data()">Refresh</button>
            </div>
          </div>
          <div class="uk-card-body card_no_pad">
            <AgGridVue
              ref="table"
              :gridOptions="gridOptions"
              :columnDefs="columnDefs"
              :rowData="rowData"
              style="height: 50vh;"
              class="ag-theme-balham"/>
          </div>
          <div class="uk-card-footer footer-total"/>
        </div>
      </div>

      <div
        v-if="listing.shortid"
        class="uk-width-1-1">
        <div
          class="uk-card uk-card-default "
          style="margin: 20px">
          <div class="uk-card-header ">
            <h2>Listing</h2>
            <div style="float: right;">
              <!-- <button class="uk-button uk-button-default" @click="payFisher()">Pay</button> -->
            </div>
          </div>
          <div class="uk-card-body">
            Fisher {{ listing.first_name }} {{ listing.last_name }}<br>
            Catch {{ listing.shortid }} {{ listing.catch_tag }} <a
              :href="'http://hooktocook.abalobi.info/#/catch/' + listing.catch_tag"
              target="_blank">Restaurant QR Code</a><br>
            Amount {{ rand_formatter2(listing.item_price) }}<br>
            <span v-if="!listing.show_pay_button"> Paid to Fisher {{ listing.payout_time }}<br></span><br>
            <p><font color="red">{{ payment_result }}</font></p>
            <button
              v-if="listing.show_pay_button"
              class="uk-button uk-button-default"
              @click="payFisher()">Pay</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import axios from "axios";
export default {
  components: {
    AgGridVue,
    axios
  },
  data() {
    return {
      listing: {},
      payment_result: "",
      filter: {},
      loading: false,
      rowData: [],
      columnDefs: [
        { field: "claim_ref", headerName: "Claim", width: 200 },
        {
          field: "claim_amount",
          headerName: "Claim Amount",
          width: 160,
          valueFormatter: this.rand_formatter,
          cellStyle: {
            textAlign: "right"
          }
        },
        {
          field: "payout_amount",
          headerName: "Loan Amount",
          width: 160,
          valueFormatter: this.rand_formatter,
          cellStyle: {
            textAlign: "right"
          }
        },
        {
          field: "clawback_amount",
          headerName: "Clawback Amount",
          width: 160,
          valueFormatter: this.rand_formatter,
          cellStyle: {
            textAlign: "right"
          }
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
        onGridReady: function() {}
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
    this.grid_fetch_data();
  },
  methods: {
    viewCellRenderer() {
      return '<div class="btn__blue">VIEW</div>';
    },
    payCellRenderer(params) {
      var s = "<div></div>";
      if (!params.data.payout_time || params.data.payout_time == "") {
        s = '<div class="btn__blue">PAY</div>';
      }
      return s;
    },
    deleteCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>🚫</b></h3></div>';
    },
    avatarCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>🎣</b></h3></div>';
    },
    openListing(params) {
      this.payment_result = "";
      if (params.data.payout_time && params.data.payout_time != "") {
        params.data.show_pay_button = false;
      } else {
        params.data.show_pay_button = true;
      }
      this.listing = params.data;
    },
    payFisher() {
      let request = this.listing;
      var _this = this;
      this.payment_result = "";
      axios
        .post(this.$store.state.api_url + "/listings_verified_pay", request)
        .then(response => {
          if (response.data.http_code != "200") {
            if (response.data.err_message) {
              _this.payment_result = response.data.err_message;
            } else {
              _this.payment_result = "End point error";
            }
          } else {
            alert("Payment processed successfully");
            this.listing = {};
            this.grid_fetch_data();
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    grid_fetch_data() {
      let request = {
        filter: this.filter
      };
      axios
        .post(this.$store.state.api_url + "/claims", request)
        .then(response => {
          this.rowData = response.data.data;
        })
        .catch(error => {
          console.error(error);
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
    rand_formatter2(amount) {
      if (!amount) {
        amount = 0;
      }
      return (
        "R " + amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      );
    },
    count_formatter(params) {
      var res = "";
      if (params.value != 0) {
        res = params.value;
      }
      return res;
    }
  }
};
</script>
