<template>
  <div class="uk-container uk-container-large">
    <div uk-grid>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default ">
          <div class="uk-card-header ">
            <h2>Master Account {{ total_formatted }}</h2>
          </div>
          <div class="uk-card-body ">
            <chart
              id="graph1"
              :option="graphoption1"
              style="height: 600px; width: 100%;"
              @click="graphClick" />
          </div>
        </div>
      </div>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default ">
          <div class="uk-card-header ">
            <h2>Accounts {{ selected_label }}</h2>
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
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import axios from "axios";
import echarts from "echarts";
export default {
  components: {
    AgGridVue,
    axios
  },
  data() {
    return {
      selected_label: "",
      rowData: [],
      columnDefs: [
        {
          headerName: "",
          field: "",
          editable: true,
          cellRenderer: this.infoCellRenderer,
          onCellClicked: this.openAccount,
          width: 100
        },
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
          width: 150,
          valueFormatter: this.rand_formatter,
          cellStyle: { textAlign: "right" }
        },
        {
          field: "txcnt",
          headerName: "TX Cnt",
          width: 150,
          valueFormatter: this.count_formatter,
          cellStyle: { textAlign: "right" }
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
      graph1instance: {},
      graphoption1: {
        title: {
          text: "Click on a slice of the pie to list the accounts breakdown",
          x: "center"
        },
        color: ["#4B69FF", "#00ECD2", "#FC0464", "#76D6FF"],
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [] //"January", "February", "March", "April", "May"
        },
        series: [
          {
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },

      total_formatted: "R 0.00"
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
    this.graph1instance = echarts.init(document.getElementById("graph1"));
    this.graph_fetch_data();
    window.addEventListener("resize", this.resize, {
      once: false,
      passive: true,
      capture: false
    });
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
    grid_fetch_data(graphdata) {
      this.selected_label = graphdata.name;
      this.rowData = [];
      let request = graphdata;
      axios
        .post(
          this.$store.state.api_url + "/master_account_subtype_accounts",
          request
        )
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
    },
    graph_fetch_data() {
      var _this = this;
      let request = {};
      axios
        .post(this.$store.state.api_url + "/master_account_breakdown", request)
        .then(response => {
          var b1 = response.data.data.breakdown;

          var total = 0;
          for (var i = 0; i < b1.length; i++) {
            var r = b1[i];
            total = total + r.balance;
          }
          _this.total_formatted = _this.rand_formatter2(total);
          var pie_data1 = [];
          for (var i = 0; i < b1.length; i++) {
            var r = b1[i];
            var o = {};
            o.value = r.balance;
            o.name = r.sub_type + " " + this.rand_formatter2(r.balance);
            o.sub_type = r.sub_type;
            o.master_account_id = r.master_account_id;
            pie_data1.push(o);
          }
          _this.graphoption1.series[0].data = pie_data1;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    graphClick(event) {
      this.grid_fetch_data(event.data);
    },
    resize() {
      this.graph1instance.resize();
    }
  }
};
</script>
