<template>
  <modal
    name="transaction-modal"
    width="1200"
    height="auto"
    @before-open="beforeOpen">
    <div class="uk-card uk-card-default " >
      <div class="uk-card-header ">
        <h2>Transaction Entries</h2>
      </div>
      <div class="uk-card-body">
        <div class="wrapper">
          <table class="uk-table uk-table-divider">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Type</th>
                <th align="right">Amount</th>
                <th>Reference</th>
                <th>UUID</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="t in transactions"
                :key="t.id">
                <td>{{ t.owner }}</td>  <!-- width="20%"  -->
                <td>{{ t.type }}</td>
                <td align="right">{{ rand_formatter2(t.amount) }}</td>
                <td>{{ t.reference }}</td>
                <td>{{ t.uu_id }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="uk-card-footer uk-text-right">
        <button
          class="uk-button uk-button-default uk-button-small button-back"
          style="margin: 5px 0"
          @click="close()">Close</button>
      </div>
    </div>
  </modal>
</template>
<script>
import axios from "axios";
export default {
  name: "TransactionModal",
  data() {
    return {
      item: {},
      transactions: [],
      temp_item: {
        id: 19059,
        tx_id: 9698,
        event_name: "Fisher Catch Payment",
        reference: "Catch r1vOLCUtQ Yellow Tail",
        create_time: "2018-10-09T11:06:07.365Z",
        amount: 395.2,
        currency_symbol: "R",
        uu_id: "8a5cb6bb-7b07-4607-a026-e36c95565531",
        balance: 395.2,
        tx_time: "2018-10-09"
      }
    };
  },
  methods: {
    fetch_data() {
      let request = {
        id: this.item.tx_id
      };
      axios
        .post(this.$store.state.api_url + "/tx_detail", request)
        .then(response => {
          this.transactions = response.data.data;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    rand_formatter2(amount) {
      if (!amount) {
        amount = 0;
      }
      return (
        "R " + amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      );
    },
    beforeOpen(event) {
      this.item = event.params.params.data;
      this.fetch_data();
    },
    close() {
      this.$modal.hide("transaction-modal");
    }
  }
};
</script>
