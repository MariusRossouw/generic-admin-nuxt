<template>
  <div class="uk-container uk-container-large">
    <div uk-grid >
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default">
          <div class="uk-card-header">
            <h2>Bank Statement</h2>
            <button
              style="float:right"
              class="uk-button uk-button-default"
              @click="grid_fetch_data()">Refresh</button>
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
          <div class="uk-card-footer footer-total">
            <p>Total Balance: <b>{{ balance_formatted }}</b></p>
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
  head() {
    return {
      title: "Statement "
    };
  },
  data() {
    return {
      rowData: [],
      balance_formatted: "R 0.00",
      columnDefs: [
        {
          field: "DTPOSTED",
          headerName: "Date",
          width: 100
        },
        {
          field: "TRNAMT",
          headerName: "Amount",
          width: 120
        },
        {
          field: "MEMO",
          headerName: "Description",
          width: 120
        }
      ],
      gridOptions: {
        defaultColDef: {
          // allow every column to be aggregated
          //enableValue: true,
          // allow every column to be grouped
          //enableRowGroup: true,
          // allow every column to be pivoted
          //enablePivot: true
        },
        suppressPropertyNamesCheck: true,
        enableColResize: true,
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
    this.grid_fetch_data();
  },
  methods: {
    rand_formatter2(amount) {
      return (
        "R " + amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      );
    },
    back() {
      this.$router.push("/profile/" + this.$route.params.id);
    },
    grid_fetch_data() {
      var _this = this;
      let request = {};
      axios
        .post(this.$store.state.api_url + "/statement", request)
        .then(response => {
          _this.rowData = response.data.data.history;
          _this.balance_formatted = _this.rand_formatter2(
            response.data.data.balance
          );
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>
