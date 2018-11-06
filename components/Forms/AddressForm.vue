<template>
  <div class="uk-width-1-2 uk-grid-margin address_block">
    <h3>Address {{ count }}</h3>
    <select v-model="address.address_type_id">
      <option
        v-for="(item, index) in itemdata"
        :key="index"
        :value="item.id"> {{ item.description }} </option>
    </select>
    <input
      v-model="address.city"
      class="uk-input"
      type="text"
      placeholder="City/Town">
    <input
      v-model="address.street"
      class="uk-input"
      type="text"
      placeholder="Street">
    <button @click="removeAddressItem()"> X </button>
  </div>
</template>

<script>
export default {
  props: ["itemdata", "address", "count"],
  data() {
    return {
      selected: this.itemdata[0]
    };
  },
  methods: {
    removeAddressItem() {
      this.$emit("removeAddressItem");
    }
  }
};
</script>
