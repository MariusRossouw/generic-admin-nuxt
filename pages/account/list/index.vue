<template>
  <div class="uk-container uk-container-large">
    <div uk-grid>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default" >
          <div class="uk-card-header ">
            <h2>System Accounts</h2>
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
              style="height: 50vh; "
              class="ag-theme-balham"/>
          </div>
          <div class="uk-card-footer footer-total">
            <p>Total Balance: <b>{{ total }}</b></p>
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
      loading: false,
      rowData: [],
      total: 0,
      columnDefs: [
        {
          field: "master_account_name",
          headerName: "Master",
          width: 120
        },
        {
          field: "type",
          headerName: "Type",
          width: 120
        },
        {
          field: "account_no",
          headerName: "Account No",
          width: 120
        },
        {
          field: "name",
          headerName: "Name",
          width: 170
        },
        {
          field: "balance",
          headerName: "Balance",
          width: 100,
          valueFormatter: this.rand_formatter,
          cellStyle: { textAlign: "right" }
        },
        {
          field: "txcnt",
          headerName: "TX Cnt",
          width: 100,
          valueFormatter: this.count_formatter,
          cellStyle: { textAlign: "right" }
        },
        {
          headerName: "",
          field: "",
          editable: true,
          cellRenderer: this.infoCellRenderer,
          onCellClicked: this.openAccount,
          width: 100
        }
      ],
      gridOptions: {
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
        },
        rowClassRules: {
          "blue-class": function(params) {
            return params.data.master_account_name === "TOTAL";
          }
        }
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
        infoCellRenderer() {
          return '<div class="btn__blue">VIEW</div>';
        },
        checkboxCellRenderer() {
          return '<div style="cursor: pointer;"><h3><b>ⓘ</b></h3></div>';
        },
        openAccount(params) {
          this.$router.push("/account/" + params.data.id);
        },
        grid_fetch_data() {
          let request = {};
          axios
            .post(this.$store.state.api_url + "/account_list", request)
            .then(response => {
              var total = 0;
              for (var i = 0; i < response.data.data.system.length; i++) {
                total = total + response.data.data.system[i].balance;
              }
              this.total = total;
              this.rowData = response.data.data.system;
            })
            .catch(error => {
              console.log(error.response);
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
        count_formattern(params) {
          var res = "";
          if (params.value != 0) {
            res = params.value;
          }
          return res;
        }
      }
    };
  }
};

// NOTE: rand_formatter2(total) throwing an error in line 23
</script>

<style lang="scss">
.ag-theme-balham .blue-class {
  div[col-id="selected"] {
    display: none !important;
  }
}
</style>
