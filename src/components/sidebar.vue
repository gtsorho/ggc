<template>
  <div id="mySidenav" class="sidenav px-1 d-flex flex-column" >
  <span style="font-size:20px;cursor:pointer"  class="text-secondary humburger text-center ms-2"  v-show="!sidebarbool" @click="sidebarbool = !sidebarbool; $emit('humburgerClick') ">&#9776;</span>
  <div>
    <span class="text-start" >
      <div class="d-flex justify-content-center"> 
        <img  style="width:30%;" v-if="sidebarbool"  src="../assets/logo.png">
        <img  style="width:80%;" v-else class="mt-2" src="../assets/logo.png">
        <!-- <h1 class="text-warning" v-if="sidebarbool" style=" margin-bottom: 0.2rem;">GGC<span style="font-size:12px"></span></h1>
        <h1 class="text-warning" v-else style=" font-size:50%; margin-bottom: 0.2rem;">GGC</h1> -->
      </div>

        <hr class=" mx-2" style="border: 1.55px solid rgb(120 120 120)">  
        <router-link :to="{name:'dashboards'}" class="btn nav_btn my-3 py-0"  @click="activeBtn = 'Dashboard'" :class="{active: activeBtn === 'Dashboard' }" ><i class="bi bi-columns-gap me-1" ></i><span v-if="sidebarbool">Dashboard</span></router-link>
        <router-link :to="{name:'members'}" class="btn nav_btn my-3 py-0"  @click="activeBtn = 'Members'" :class="{active: activeBtn === 'Members' }" ><i class="bi bi-people me-1" ></i><span v-if="sidebarbool">Members</span></router-link>
        <router-link :to="{name:'incomes'}" class="btn nav_btn my-3 py-0"  @click="activeBtn = 'Income'" :class="{active: activeBtn === 'Income' }" ><i class="bi bi-wallet2 me-1" ></i><span v-if="sidebarbool">Income</span> </router-link>
        <router-link :to="{name:'tithes'}" class="btn nav_btn my-3 py-0"  @click="activeBtn = 'Tithe'" :class="{active: activeBtn === 'Tithe' }" ><i class="bi bi-currency-exchange me-1" ></i><span v-if="sidebarbool">Tithe</span> </router-link>
        <router-link :to="{name:'debts'}" class="btn nav_btn my-3 py-0"   @click="activeBtn = 'Debts'" :class="{active: activeBtn === 'Debts' }"><i class="bi bi-receipt me-1" ></i><span v-if="sidebarbool">Debts</span> </router-link>
        <router-link :to="{name:'expenses'}" class="btn nav_btn my-3 py-0"   @click="activeBtn = 'Expenses'" :class="{active: activeBtn === 'Expenses' }"><i class="bi bi-cash-coin me-1" ></i><span v-if="sidebarbool">Expenses</span></router-link>
        <router-link :to="{name:'ledgers'}" class="btn nav_btn my-3 py-0"   @click="activeBtn = 'Ledger'" :class="{active: activeBtn === 'Ledger' }"><i class="bi bi-file-ruled me-1" ></i><span v-if="sidebarbool">Ledger</span></router-link>
        <router-link :to="{name:'records'}" class="btn nav_btn my-3 py-0"   @click="activeBtn = 'Records'" :class="{active: activeBtn === 'Records' }"><i class="bi bi-card-list me-1" ></i><span v-if="sidebarbool">Records</span></router-link>    
        <router-link :to="{name:'events'}" class="btn nav_btn my-3 py-0"   @click="activeBtn = 'Events'" :class="{active: activeBtn === 'Events' }"><i class="bi bi-calendar2-event me-1" ></i><span v-if="sidebarbool">Events</span></router-link>    
    </span>
    </div>
    <div class="mt-auto py-4" style="width:100%">
      <ul class="list-group list-group-flush" :class="sidebarbool ? 'px-4': ''">
        <li class="list-group-item border-0 p-0 my-2">
          <router-link :to="{name:'settings'}" class="btn btn-sm setBtn justify-content-center py-0 d-flex" ><i class="bi bi-gear mx-2" ></i><span v-if="sidebarbool">Settings</span> </router-link>
        </li>
        <li class="list-group-item border-0 p-0 my-0">
          <router-link :to="{name:'login'}" class=" btn btn-sm logout justify-content-center py-0 d-flex" @click="logout()" ><i class="bi bi-power mx-2"></i><span v-if="sidebarbool">Logout</span> </router-link>
        </li>
      </ul>
    </div> 
</div>
</template>
<script>
import axios from 'axios';

export default {
    name:'sidebar',
    props:[
      'sidebarVal'
    ],
    emits: [
      'humburgerClick',
      'currentTab'
      ],
    data() {
      return {  
        activeBtn:'Dashboard',
        sidebarbool:this.sidebarVal
      }
    },
    created(){
     this.activeBtn =  this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1)
    },
    mounted(){
      var w = window.innerWidth;
      if(w < 750){
        this.sidebarbool = false
        document.getElementById("mySidenav").style.width = "50px";
        document.getElementById("main").style.marginLeft= "50px";           
      }else{
        if(document.getElementById("main")){
        this.sidebarbool = true
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px"; 
        }
      }
    },
    watch:{
      sidebarVal(newVal){
        if(newVal){
          this.sidebarbool = true
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";            
        }else{
          this.sidebarbool = false
            document.getElementById("mySidenav").style.width = "50px";
            document.getElementById("main").style.marginLeft= "50px";
        }
      },
      sidebarbool(newVal){
        if(newVal){
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";            
        }else{
            document.getElementById("mySidenav").style.width = "50px";
            document.getElementById("main").style.marginLeft= "50px";
        }
      }
    },
    methods: {
      logout(){
          this.setCookie('token', null)
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
    },
     setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";"+ expires + ";path=/";
      },
    },
}
</script>
<style scoped>
.list-group-item{
  background-color: #faf8f900 !important;
}
 /* card style */
    /* margin: 10px; */
    /* width: 80.5% !important;*********************** */
    /* height: 90%; */
    /* position: fixed !important;***************** */
    /* z-index: 1;
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 10px; */

.humburger:hover{
  color: #d5d5d5 !important;
}
.accordion-button:focus {
    z-index: 3;
    border-color: rgba(7, 7, 7, 0) !important;
    outline: 0;
  box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 0%) !important;
}
#flush-collapseOne a {
  padding-left: 20% !important;
  text-decoration: none;
  font-size: 13px !important;
  color: #818181;
  display: block;
  transition: 0.3s;

}
 #flush-collapseOne a:hover {
  color: #f1f1f1;
}

.sidenav {
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  /* background: #000633; */
  background-image: linear-gradient(198deg, #01001c, #000633) !important;
  
  /* border-right: 3px solid rgb(201, 201, 201); */
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 10px;
}

.sidenav a {
  /* padding: 8px 8px 8px 32px;  */
  text-decoration: none;
  font-size: 15px;
  /* background-color: transparent !important; */
  color: #818181;
  display: block;
  text-align: left !important;
  transition: 0.3s;
}

.sidenav .nav_btn:hover {
  color: #ffffff;
  background-image: linear-gradient(198deg, #000633, #ffc412) !important;
  border: none;
  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
}
.sidenav .settings:hover {
  background-image: linear-gradient(198deg,#000633, #ffc412) !important;

  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
}

.active {
  background-image: linear-gradient(198deg, #000633, #ffc412) !important;
  color: #fff !important;
  border: 0px;
 box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}

.logout{
  border:#5c0000 1px solid;
}
.logout:hover{
  border:#5c0000 1px solid;
  background-color:#5c0000 ;
}

.setBtn{
  border:#aa9901 1px solid;
}
.setBtn:hover{
  border:#aa9901 1px solid;
  background-color:#aa9901 ;
}
</style>