<template>
  <header>

  </header>

  <RouterView/>
</template>

<script setup>

import HelloWorld from './components/HelloWorld.vue'

</script>

<style >
@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Baskervville&family=Poppins:ital,wght@0,100;0,300;0,500;0,700;1,100&display=swap');

p, h1,h2,h3,h4,h5, small, strong, a, li,option, form, select, option ,th ,div{
  font-family: 'Raleway', sans-serif !important;
}

h1,h2, a, th{
  font-family:  'Baskervville', serif;
}
html, body, #app
{
    height: 100%;
}
</style>
