<template>
  <modal
    name="admin-modal"
    width="600"
    height="auto">
    <div class="uk-card uk-card-default uk-padding-remove">
      <div class="uk-card-header uk-text-center">
        <h3>New Admin </h3>
      </div>
      <div class="uk-card-body ">
        <div uk-grid>
          <div class="uk-width-1-3 ">First name:</div>
          <div class="uk-width-2-3 uk-form-controls ">
            <input
              v-model="admin_data.first_name"
              placeholder="first name"
              class="uk-input uk-form-width-large"
              type="text">
          </div>
        </div>
        <div uk-grid>
          <div class="uk-width-1-3">Last name:</div>
          <div class="uk-width-2-3 uk-form-controls ">
            <input
              v-model="admin_data.last_name"
              placeholder="last name"
              class="uk-input uk-form-width-large"
              type="text">
          </div>
        </div>
        <div uk-grid>
          <div class="uk-width-1-3">Email:</div>
          <div class="uk-width-2-3 uk-form-controls">
            <input
              v-model="admin_data.email"
              placeholder="email"
              class="uk-input uk-form-width-large"
              type="text">
          </div>
        </div>
        <div uk-grid>
          <div class="uk-width-1-3 ">Password:</div>
          <div class="uk-width-2-3 uk-form-controls">
            <input
              v-model="admin_data.password"
              placeholder="password"
              class="uk-input uk-form-width-large"
              type="text">
          </div>
        </div>
        <br>
        <div class="uk-align-right">
          <button
            class="uk-button uk-button-primary"
            @click="add_new_admin">add</button>&nbsp;
          <button
            class="uk-button uk-button-primary"
            @click="close">cancel</button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import axios from "axios";
export default {
  name: "AdminModal",
  data() {
    return {
      item: {},
      admins: [],
      admin_data: {}
    };
  },
  methods: {
    add_new_admin: function() {
      var payload = {};
      payload.first_name = this.admin_data.first_name;
      payload.last_name = this.admin_data.last_name;
      payload.email = this.admin_data.email;
      payload.password = this.admin_data.password;
      payload.type = "Admin";
      payload.app_name = "Medipocket";
      axios
        .post(this.$store.state.api_url + "/profile_create", payload)
        .then(() => {
          alert("NEW ADMIN IS CREATED");
          this.$modal.hide("admin-modal");
          this.grid_fetch_data();
        })
        .catch(err => {
          console.log(err);
        });
    },
    close() {
      this.$modal.hide("admin-modal");
    }
  }
};
</script>
