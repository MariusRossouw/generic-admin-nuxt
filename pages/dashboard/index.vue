<template>
  <div class="uk-container uk-container-large">
    <div uk-grid>
      <div class="info_blocks">
        <div class="block">
          <img src="@/assets/icon_wallet.svg">
          <p>Loan Book</p>
          <strong>{{ rand_formatter2(dbdata.total_loan_book) }}</strong><small/>
        </div>
        <div class="block">
          <img src="@/assets/icon_float.svg">
          <p>Settlement</p>
          <strong>{{ rand_formatter2(dbdata.total_settlement) }}</strong><small/>
        </div>
        <div class="block">
          <img src="@/assets/icon_wallet.svg">
          <p>Wallets Total</p>
          <strong>{{ rand_formatter2(dbdata.total_wallets) }}</strong><small/>
        </div>
        <div class="block">
          <img src="@/assets/icon_float.svg">
          <p>Fees</p>
          <strong>{{ rand_formatter2(dbdata.total_fees) }}</strong><small/>
        </div>
      </div>
      <div class="uk-width-2-5">
        <div class="uk-card uk-card-default ">
          <div class="uk-card-header ">
            <h2>{{ graph1_header }}</h2>
          </div>
          <div class="uk-card-body ">
            <chart
              id="graph1"
              :option="graphoption1"
              style="height: 400px; width: 100%;"
            />
          </div>
        </div>
      </div>
      <div class="uk-width-3-5">
        <div class="uk-card uk-card-default ">
          <div class="uk-card-header ">
            <h2>{{ graph2_header }} {{ graph2_filter_period }}</h2>
            <button
              :class="{ active: (graph2_filter_period == 'Monthly') }"
              style="float:right; margin-right: 5px"
              class="uk-button uk-button-default"
              @click="graph2_fetchdata('Monthly')">Monthly</button>&nbsp;
            <button
              :class="{ active: (graph2_filter_period == 'Weekly') }"
              style="float:right; margin-right: 5px"
              class="uk-button uk-button-default"
              @click="graph2_fetchdata('Weekly')">Weekly</button>&nbsp;
            <button
              :class="{ active: (graph2_filter_period == 'Daily') }"
              style="float:right; margin-right: 5px"
              class="uk-button uk-button-default"
              @click="graph2_fetchdata('Daily')">Daily</button>
          </div>
          <div class="uk-card-body ">
            <chart
              id="graph2"
              :option="graphoption2"
              style="height: 400px; width: 100%;"
            />
          </div>
        </div>
      </div>
      <div class="uk-width-1-1">
        <div class="uk-card uk-card-default ">
          <div class="uk-card-header ">
            <h2>Recent</h2>
            <button
              style="float:right"
              class="uk-button uk-button-default"
              @click="grid_download()">Download</button>
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
    <br>
    <br>
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
      graph1_header: "Balances",
      graph1instance: {},
      graphoption1: {
        color: ["#fdb515", "#000000", "#e43364", "#a8ccc7", "#409f96"],
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
            radius: ["50%", "70%"],
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

      graph2_header: "Transactions",
      graph2_filter_period: "Weekly",
      graph2instance: null,
      graphoption2: {
        color: ["#e43364", "#a8ccc7", "#409f96", "#fdb515", "#000000"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value"
        },
        legend: {
          data: ["Buy", "Sell", "Redeem", "Send", "Pay"]
        },
        series: []
      },

      selected_label: "",
      rowData: [],
      columnDefs: [
        {
          field: "tx_time",
          headerName: "Time",
          width: 120
        },
        {
          field: "event_name",
          headerName: "Type",
          width: 120
        },
        {
          field: "client",
          headerName: "Client",
          width: 120
        },
        {
          field: "amount",
          headerName: "Amount",
          width: 120,
          valueFormatter: this.oz_formatter,
          cellStyle: {
            textAlign: "right"
          }
        },
        {
          field: "reference",
          headerName: "Reference",
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
      },
      dbdata: {}
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
    this.graph2instance = echarts.init(document.getElementById("graph2"));
    this.graph_fetch_data("Weekly");
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
        v = "OZ " + Number(params.value).toFixed(4);
        //.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
      return v;
    },
    rand_formatter2(amount) {
      var v = "0.00";
      if (amount) {
        v =
          "R " +
          Number(amount)
            .toFixed(2)
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
      return v;
    },
    oz_formatter2(amount) {
      return (
        "OZ " + amount.toFixed(4)
        //.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      );
    },
    count_formatter(params) {
      var res = "";
      if (params.value != 0) {
        res = params.value;
      }
      return res;
    },

    graph1_fetchdata() {},
    graph2_fetchdata(period) {
      var _this = this;
      let request = { period: period };
      axios
        .post(this.$store.state.api_url + "/dashboard_read_v2_graph", request)
        .then(response => {
          this.graph2_filter_period = period;
          var resp = response.data.data;
          var graph2_init = {
            color: ["#fdb515", "#000000", "#00768a", "#00b2e6"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            yAxis: {
              type: "value"
            },
            legend: {
              data: []
            },
            xAxis: {
              type: "category",
              data: []
            },
            series: []
          };
          graph2_init.legend.data = resp.graph2_legend_data;
          graph2_init.xAxis.data = resp.graph2_xaxis_data;
          graph2_init.series = resp.graph2_series_data;
          _this.graphoption2 = graph2_init;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    grid_download() {
      var params = {
        fileName: "MediPocket Recent Activity"
      };
      this.gridOptions.api.exportDataAsExcel(params);
    },
    viewTXDetail() {},
    graph_fetch_data(period) {
      this.graph2_filter_period = period;
      var _this = this;
      let request = { period: period };
      axios
        .post(this.$store.state.api_url + "/dashboard_read_v2", request)
        .then(response => {
          var resp = response.data.data;
          this.dbdata = resp;

          _this.graph1_header = resp.graph1_header;
          var pie_data1 = resp.graph1_data;
          _this.graphoption1.series[0].data = pie_data1;

          _this.graph2_header = resp.graph2_header;
          var graph2_init = {
            color: ["#fdb515", "#000000", "#00768a", "#00b2e6"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow"
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            yAxis: {
              type: "value"
            },
            legend: {
              data: []
            },
            xAxis: {
              type: "category",
              data: []
            },
            series: []
          };
          graph2_init.legend.data = resp.graph2_legend_data;
          graph2_init.xAxis.data = resp.graph2_xaxis_data;
          graph2_init.series = resp.graph2_series_data;
          _this.graphoption2 = graph2_init;
          _this.rowData = resp.recent_tx;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    resize() {
      this.graph1instance.resize();
      this.graph2instance.resize();
    }
  }
};
</script>
