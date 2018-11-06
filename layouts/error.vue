<template>
  <div class="error-page">
    <h1 v-if="error.statusCode === 404">The page you are looking for does not exist</h1>
    <h1 v-else >Oops, something went wrong!</h1>
    <p>Back to <a href="/">safety</a>!</p>
  </div>
</template>

<script>
export default {
  props: ["error"]
};
</script>

<style scoped>
.error-page {
  text-align: center;
}

.error-page a {
  text-decoration: none;
  color: red;
}

.error-page a:hover,
.error-page a:active {
  color: salmon;
}
</style>
