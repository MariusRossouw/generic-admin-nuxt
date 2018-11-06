<template>
  <div uk-grid >
    <div class="uk-width-1-1">
      <div
        class="uk-card uk-card-default "
        style="margin: 20px">
        <div class="uk-card-header ">
          <h4>Account {{ account.account_no }}</h4>
          <button
            class="uk-button uk-button-default"
            @click="grid_fetch_data()">Refresh</button>
          <div
            v-if="account.profile_id"
            style="float: right;">
            <button
              class="uk-button uk-button-default"
              @click="gotoProfile()">Profile</button>
          </div>
        </div>
        <div class="uk-card-body ">
          <p>
            {{ account.name }} ({{ account.type }})
            <br> {{ account.balance_formatted }}
          </p>
          <h4>Transactions</h4>

          <AgGridVue
            ref="table"
            :gridOptions="gridOptions"
            :columnDefs="columnDefs"
            :rowData="rowData"
            style="height: 50vh;"
            class="ag-theme-balham"/>
        </div>
      </div>
      <TransactionModal />
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import axios from "axios";
import TransactionModal from "@/components/modals/transaction";
export default {
  components: {
    AgGridVue,
    axios,
    TransactionModal
  },
  data() {
    return {
      account: {},
      loading: false,
      rowData: [],
      columnDefs: [
        {
          field: "tx_time",
          headerName: "Date",
          width: 120
        },
        {
          field: "reference",
          headerName: "Reference",
          width: 300
        },
        {
          field: "amount",
          headerName: "Amount",
          width: 120,
          valueFormatter: this.rand_formatter,
          cellStyle: {
            textAlign: "right"
          }
        },
        {
          field: "balance",
          headerName: "Balance",
          width: 170,
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
    gotoProfile() {
      this.$router.push("/profile/" + this.account.profile_id);
    },
    infoCellRenderer() {
      return '<div class="btn__blue">VIEW</div>';
    },
    openTX(params) {
      this.$modal.show("transaction-modal", { params });
    },
    checkboxCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>ⓘ</b></h3></div>';
    },
    openAccount(params) {
      this.$router.push("/account/" + params.data.id);
    },
    grid_fetch_data() {
      let request = {
        id: this.$route.params.id
      };
      axios
        .post(this.$store.state.api_url + "/account_item", request)
        .then(response => {
          this.account = response.data.data;
          this.account.balance_formatted = this.rand_formatter2(
            this.account.balance
          );
          if (!this.account.transactions) {
            this.account.transactions = [];
          }
          for (var i = 0; i < this.account.transactions.length; i++) {
            var r = this.account.transactions[i];
            r.tx_time = r.create_time.substr(0, 10);
          }
          this.rowData = response.data.data.transactions;
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
