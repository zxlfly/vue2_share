<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      {{$route.params.des}}
    </div>
  </div>
</template>
<script>
export default {
  mounted () {
    console.log(this.$route);
  },
}
</script>
