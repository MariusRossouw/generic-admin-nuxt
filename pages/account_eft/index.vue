<template>
  <div class="uk-container uk-container-large">
    <div uk-grid >
      <div class="uk-width-1-1">
        <br>
        <div class="uk-card uk-card-default ">
          <div class="uk-card-header ">
            <h2>EFT Account Value</h2>
            <div style="float: right">
              <button
                class="uk-button uk-button-default"
                @click="grid_fetch_data()">Refresh</button> &nbsp;
              <button
                class="uk-button uk-button-primary"
                @click="amounts_clear_all()">Clear All</button> &nbsp;
              <button
                class="uk-button uk-button-primary"
                @click="amounts_max()">All Balances</button>
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
          <div class="uk-card-footer footer-total">
            <p>{{ payment_result }}</p>
            <button
              class="uk-button uk-button-primary"
              @click="eft_out_amounts()">EFT Entered Amounts</button>
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
      filter: {},
      payment_result: "",
      loading: false,
      rowData: [],
      columnDefs: [
        { field: "account_no", headerName: "Account No", width: 120 },
        { field: "name", headerName: "Name", width: 170 },
        {
          field: "balance",
          headerName: "Wallet Balance",
          width: 150,
          valueFormatter: this.rand_formatter,
          cellStyle: { textAlign: "right" }
        },
        {
          field: "amount",
          headerName: "EFT Amount",
          width: 150,
          valueFormatter: this.rand_formatter,
          cellStyle: { textAlign: "right" },
          valueSetter: this.amountEditSetter,
          editable: true
        },
        {
          field: "eft_message",
          headerName: "Reference",
          width: 150,
          valueSetter: this.messageEditSetter,
          editable: true
        },
        { field: "error_message", headerName: "Error Message", width: 400 }
      ],
      gridOptions: {
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
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.grid_fetch_data();
  },
  methods: {
    validateNumber(n) {
      const r = { valid: false, value: 0, orig: "null" };
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
    infoCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>ℹ</b></h3></div>';
    },
    deleteCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>🚫</b></h3></div>';
    },
    avatarCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>🎣</b></h3></div>';
    },
    grid_row_clicked() {
      this.$router.push("/account/" + params.data.id);
    },
    amountEditSetter(params) {
      const r = this.validateNumber(params.newValue);

      if (!r.valid) {
        params.data["amount"] = 0;
        params.data["error_message"] = 'Invalid number format "' + r.orig + '"';
        return true;
      }

      if (r.value > params.data["balance"]) {
        params.data["amount"] = r.value;
        params.data["error_message"] =
          "Amount is bigger than the available balance";
        return true;
      }

      if (r.value < 0) {
        params.data["amount"] = r.value;
        params.data["error_message"] = "Amount can not be negative";
        return true;
      }

      params.data["amount"] = r.value;

      let s = params.data["eft_message"] || "";
      s = s.trim();
      if (r.value > 0 && s.length == 0) {
        params.data["error_message"] = "Invalid EFT message";
        return true;
      }

      params.data["error_message"] = "";
      return true;
    },
    messageEditSetter(params) {
      console.log(JSON.stringify(params.data));
      let s = params.newValue || "";
      s = s.trim();
      params.data["eft_message"] = s;

      var r = this.validateNumber(params.data["amount"]);

      if (r.valid && r.value > 0 && s.length == 0) {
        params.data["error_message"] = "Invalid EFT message";
        return true;
      }

      params.data["error_message"] = "";
      return true;
    },
    grid_fetch_data() {
      axios
        .post(this.$store.state.api_url + "/account_eft_list", {})
        .then(response => {
          const resp = response.data.data;
          for (let i = 0; i < resp.length; i++) {
            resp[i].eft_message = "Abalobi wallet EFT";
            resp[i].amount = 0;
          }
          this.rowData = resp;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    rand_formatter(params) {
      let v = "0.00";
      if (params.value) {
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
    },
    eft_out_selected_rows: function() {
      const items = this.gridOptions.api.getSelectedRows();
      alert(JSON.stringify(items));
    },
    eft_out_amounts: function() {
      const items = [];
      let error_count = 0;
      this.gridOptions.api.forEachNode(function(rowNode) {
        if (rowNode.data.amount && rowNode.data.amount != 0) {
          items.push(rowNode.data);
        }
        if (
          rowNode.data.error_message &&
          rowNode.data.error_message.length > 0
        ) {
          error_count = error_count + 1;
        }
      });
      if (error_count > 0) {
        alert(
          "Some of the entries have failed conditions. Rectify and submit again."
        );
        return;
      }
      const _this = this;
      axios
        .post(this.$store.state.api_url + "/account_eft_out", {
          accounts: items
        })
        .then(response => {
          if (response.data.http_code != "200") {
            if (response.data.err_message) {
              _this.payment_result = response.data.err_message;
            } else {
              _this.payment_result = "End point error";
            }
          } else {
            alert("Payment processed successfully");
            this.grid_fetch_data();
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    amounts_clear_all: function() {
      for (let i = 0; i < this.rowData.length; i++) {
        this.rowData[i].amount = 0;
        this.rowData[i].error_message = "";
      }
      this.gridOptions.api.refreshCells();
    },
    amounts_max: function() {
      for (let i = 0; i < this.rowData.length; i++) {
        this.rowData[i].amount = this.rowData[i].balance;
        this.rowData[i].error_message = "";
      }
      this.gridOptions.api.refreshCells();
    }
  }
};
</script>
