<template>
  <a href="/" class="logo">
    <h1>Tokenary</h1>
  </a>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style lang="scss" scoped>

  .logo {
    display: flex;
    align-items: center;
    color: darken($blue,10%);
    h1 {
      color: $darkGrey;
      margin: 0;
      font-size: 2rem;
      font-weight: 400;
    }
    &:before {
      content: "";
      width: 50px;
      height: 50px;
      background: url('../../assets/logo.png') center no-repeat;
      background-size: contain;
      margin-right: 10px;
      transition: transform .7s ease;
    }
    &:hover {
      opacity:.9;
      text-decoration: none;
    }
  }

</style>
