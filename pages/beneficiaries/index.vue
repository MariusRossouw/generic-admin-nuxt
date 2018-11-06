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
            <h2>Beneficiaries</h2>
            <div style="float: right;">
              <input
                v-model="filter.search_text"
                type="text"
                placeholder="Search"
                class="uk-input uk-form-width-medium">
              <button
                class="uk-button uk-button-default"
                @click="grid_fetch_data()">Search</button>
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
          <div class="uk-card-footer  footer-total">
            <button
              class="uk-button uk-button-default uk-button-small"
              style="margin: 5px 0"
              @click="addBeneficiary()">Add Bank Account</button><br>
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
      loading: false,
      rowData: [],
      columnDefs: [
        {
          field: "account_name",
          headerName: "Name",
          width: 160
        },
        {
          field: "bank_name",
          headerName: "Bank",
          width: 200
        },
        {
          field: "branch_no",
          headerName: "Branch Code",
          width: 160
        },
        {
          field: "account_no",
          headerName: "Account No",
          width: 180
        },
        {
          headerName: "",
          field: "",
          editable: true,
          cellRenderer: this.infoCellRenderer,
          onCellClicked: this.openBeneficiary,
          width: 100
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
        // floatingFilter: true,
        enableSorting: true,
        enableFilter: true,
        // enableColResize: true,
        rowSelection: "single",
        rowHeight: 50,
        onGridReady: function(params) {
          params.api.sizeColumnsToFit();
        }
      },
      bank_list: []
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
    infoCellRenderer() {
      return '<div class="btn__blue">VIEW</div>';
    },
    addBeneficiary() {
      this.$router.push("/beneficiaries/add");
    },
    openBeneficiary(params) {
      this.$router.push("/beneficiaries/" + params.data.id);
    },
    grid_fetch_data() {
      let request = {
        filter: this.filter
      };
      axios
        .post(this.$store.state.api_url + "/beneficiary_list", request)
        .then(response => {
          this.rowData = response.data.data;
        })
        .catch(error => {
          console.log(error.response);
        });
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
