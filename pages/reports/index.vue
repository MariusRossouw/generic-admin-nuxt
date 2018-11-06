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
            <h2>Reports</h2>
          </div>
          <div class="uk-card-body">
            <table class="uk-table uk-table-divider">
              <thead>
                <tr>
                  <th>Report</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in rowData"
                  :key="p.label">
                  <td><a @click="openReport(p.path)">{{ p.label }}</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rowData: [{ label: "Transaction Types", path: "transactiontypes" }]
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
  methods: {
    openReport(path) {
      this.$router.push("/reports/" + path);
    }
  }
};
</script>
