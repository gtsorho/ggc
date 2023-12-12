<template>
   <Sidebar :sidebarVal="sidebarbool"  @humburgerClick="sidebarbool = true"  @currentTab="(data) => currentTab = data"/>
    <div id="main">
      <Navbar :sidebarbool="sidebarbool" :activeRoute="currentRoute" @changestate="sidebarbool = !sidebarbool" @searchData="passData"  :login="login"/>
        <router-view :navData="navData"></router-view>
    </div>
</template>
<script>

import Sidebar from '@/components/sidebar.vue'
import Navbar from '@/components/navbar.vue'
export default {
    components:{
    Sidebar,
    Navbar,
    },
    props:[
        'user'
    ],
    data() {
        return {
            login:false,
            navData:null,
            sidebarbool:true,
            salespoint:null
        }
    },
    created(){
        if(this.getCookie('token') == null || this.getCookie('token') == '' || !this.getCookie('token')){
            this.$router.push({name: 'login'})
        }else{
            this.login = true
        }
    },
    mounted(){
      var w = window.innerWidth;
      if(w < 750){
        this.sidebarbool = false      
      }else{
        this.sidebarbool = true
      }
    },
    methods:{
        passData(data){
            this.navData = data
        },
         getCookie(cname){
          let name = cname + "=";
          let ca = document.cookie.split(';');
          for(let i = 0; i < ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
              c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
              }
          }
          return "";
        }
    },
    computed: {
    currentRoute() {
      return this.$route.name;
    },
  },
}
</script>
<style >
        @import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');
        html,body, p, h1,h2,h4,h5,h6, th, option{
            font-family: 'Raleway', sans-serif !important;
        }
        body,html{
            background-color: #ffffff !important;  
        }
        #main {
        transition: margin-left .5s;
        padding-inline: 22px;
        margin-left: 250px;
        }
        .btn:hover{
            color: #fff !important;
        }
        .btn-outline-warning:hover{
            background: #ffc412 !important;
        }
        .btn-outline-danger:hover{
             background: #ff4064 !important;
             color: #fff !important;
        }
        /* width */
        ::-webkit-scrollbar {
        width: 10px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey; 
        border-radius: 10px;
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
        background: #ffc412; 
        border-radius: 10px;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
        background: #ffef3e; 
        }

        .form-control:focus {
            color: #212529;
            background-color: #fff;
            border-color: #ffef3e;
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgb(23 76 254 / 0%)!important;
        }


</style>
<style>
.dp__input{
  border-radius: 50px !important;
}
.dp__theme_light {
    --dp-hover-color: #fbedc0 !important;
    --dp-primary-color: #ffc412 !important;
    --dp-primary-disabled-color: #ffc4129a !important;
    --dp-scroll-bar-background: #fbedc0 !important;
    --dp-range-between-dates-background-color: var(--dp-hover-color, #fbedc0 !important);
    --dp-range-between-border-color: var(--dp-hover-color, #fbedc0 !important);
}

:root {
    /*General*/
    --dp-font-family:'Raleway', sans-serif !important;
    /*Font sizes*/
    --dp-font-size: 0.8rem !important; /*Default font-size*/

}
</style>