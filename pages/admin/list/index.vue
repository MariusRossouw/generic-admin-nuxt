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
            <h2>ADMINS</h2>
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
              class="ag-theme-balham" />
          </div>
          <div class="uk-card-footer footer-total">
            <button
              class="uk-button uk-button-default"
              @click="open_modal()">Add new Admin</button>
          </div>
        </div>
      </div>
    </div>
    <admin-modal/>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import axios from "axios";
import AdminModal from "@/components/modals/admin";

export default {
  components: {
    AgGridVue,
    axios,
    "admin-modal": AdminModal
  },
  data() {
    return {
      filter: {},
      loading: false,
      rowData: [],
      columnDefs: [
        {
          headerName: "",
          field: "",
          cellRenderer: this.infoCellRenderer,
          onCellClicked: this.openProfile,
          width: 100
        },
        { field: "first_name", headerName: "First name", width: 160 },
        { field: "last_name", headerName: "Last name", width: 160 },
        { field: "email", headerName: "Email", width: 220 },
        { field: "mobile_no", headerName: "Mobile", width: 150 },
        {
          field: "status",
          headerName: "Status",
          width: 120,
          cellClassRules: {
            work: function(params) {
              return params.data.status === "Active";
            },
            Noactive: function(params) {
              return params.data.status === "Inactive";
            }
          },
          valueFormatter: function(params) {
            if (params.data.status === "Active") {
              return "Active";
            } else {
              return "Deactivated";
            }
          }
        },
        {
          field: "id",
          headerName: "",
          width: 150,
          cellRenderer: this.Delete_Renderer,
          onCellClicked: this.deactivateprofile
        }
      ],
      gridOptions: {
        defaultColDef: {
          enableValue: true,
          enableRowGroup: true,
          enablePivot: true
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
    infoCellRenderer() {
      return '<div class="btn__blue">VIEW</div>';
    },
    Delete_Renderer(params) {
      var html = '<div class="btn__blue">Activate</div>';
      if (!params.data.status || params.data.status == "Active") {
        html = '<div class="btn__blue">Deactivate</div>';
      }
      return html;
    },
    deactivateprofile(params) {
      var new_status = "Active";
      if (!params.data.status || params.data.status == "Active") {
        new_status = "Inactive";
      }

      let confirmation;
      if (new_status == "Inactive") {
        confirmation = confirm(
          `Do you confirm the deactivation,   the account of: ${
            params.data.first_name
          } ${params.data.last_name}`
        );
      } else {
        confirmation = confirm(
          `Do you confirm the Activation, the account of: ${
            params.data.first_name
          } ${params.data.last_name}`
        );
      }
      if (confirmation === true) {
        var payload = {
          status: new_status,
          id: params.data.id,
          type: "admin"
        };
        axios({
          method: "post",
          url: this.$store.state.api_url + "/profile_update",
          data: payload
        }).then(() => {
          this.grid_fetch_data();
        });
      } else {
        return;
      }
    },
    openProfile(params) {
      this.$router.push("/admin/" + params.data.id);
    },
    grid_fetch_data() {
      let request = {
        filter: this.filter,
        type: "Admin"
      };
      axios
        .post(this.$store.state.api_url + "/profile_list", request)
        .then(response => {
          this.rowData = response.data.data;
          this.gridOptions.api.setColumnDefs(this.columnDefs);
          this.gridOptions.api.setRowData(response.data.data);
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
    },
    open_modal() {
      this.$modal.show("admin-modal");
    }
  }
};
</script>

  <style>
.work {
  color: rgb(163, 215, 100);
  text-transform: uppercase;
}

.Noactive {
  color: rgb(255, 138, 137);
  text-transform: uppercase;
}
</style>
