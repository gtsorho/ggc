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
.form-control{
    width: 100%;
    border:0px solid transparent;
    border-radius: 0;
    border-bottom: 1px solid #aaa;
    padding: .1em .1em .1em;
    padding-left: 2em;
    outline:none;
    margin:.5em auto;
    transition: all .5s ease;
}        
.form-control:focus{
            border-bottom-color: #ffc107;
            box-shadow: 0 0 5px #ffc1078d; 
            border-radius: 4px;
        }
</style>
