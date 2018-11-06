<template>
  <div 
    id="accounts_abalobi" 
    uk-grid>
    <div class="uk-width-1-1">
      <div 
        class="uk-card uk-card-default " 
        style="margin: 20px">
        <div class="uk-card-header ">
          <h2>Transaction Types Per Month</h2>
          <button 
            style="float:right" 
            class="uk-button uk-button-default" 
            @click="grid_download()">Download</button>
        </div>
        <div class="uk-card-body">
          <AgGridVue 
            ref="table" 
            :gridOptions="gridOptions" 
            :columnDefs="columnDefs" 
            :rowData="rowData" 
            style="height: 50vh; " 
            class="ag-theme-balham" />
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
      rowData: [],
      columnDefs: [
        {
          field: "month",
          headerName: "Month",
          width: 120
        },
        {
          field: "event_name",
          headerName: "Type",
          width: 160
        },
        {
          field: "cnt",
          headerName: "Cnt",
          width: 120
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
    grid_download() {
      var params = {
        fileName: "Abalobi Transaction Types Per Month"
      };
      this.gridOptions.api.exportDataAsExcel(params);
    },
    grid_fetch_data() {
      let request = {};
      axios
        .post(this.$store.state.api_url + "/transaction_type_summary", request)
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
    rand_formatter2(amount) {
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
