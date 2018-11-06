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
            <h2>Profiles</h2>
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
          <div class="uk-card-footer footer-total"/>
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
        { field: "first_name", headerName: "First name", width: 140 },
        { field: "last_name", headerName: "Last name", width: 140 },
        { field: "email", headerName: "Email", width: 220 },
        { field: "mobile_no", headerName: "Mobile", width: 140 },
        {
          field: "wallet_balance_rand",
          headerName: "Rand Balance",
          width: 160,
          valueFormatter: this.rand_formatter,
          cellStyle: { textAlign: "right" }
        },
        {
          field: "wallet_balance_gold",
          headerName: "Gold Balance",
          width: 160,
          valueFormatter: this.oz_formatter,
          cellStyle: { textAlign: "right" }
        },
        {
          headerName: "",
          field: "",
          editable: true,
          cellRenderer: this.infoCellRenderer,
          onCellClicked: this.openProfile,
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
    infoCellRenderer() {
      return '<div class="btn__blue">VIEW</div>';
    },
    deleteCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>🚫</b></h3></div>';
    },
    avatarCellRenderer() {
      return '<div style="cursor: pointer;"><h3><b>🎣</b></h3></div>';
    },
    openProfile(params) {
      this.$router.push("/profile/" + params.data.id);
    },
    deleteProfile(params) {
      let request = {
        id: params.data.id,
        permanent: false
      };
      axios
        .post(this.$store.state.api_url + "/profile_delete", request)
        .then(() => {
          this.grid_fetch_data();
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    grid_fetch_data() {
      let request = {
        filter: this.filter
      };
      axios
        .post(this.$store.state.api_url + "/profile_list", request)
        .then(response => {
          this.gridOptions.api.setColumnDefs(this.columnDefs);
          this.gridOptions.api.setRowData(response.data.data);
          this.rowData = response.data.data;
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
    oz_formatter(params) {
      var v = "0.00";
      if (params.value) {
        v = "OZ " + Number(params.value).toFixed(6);
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
