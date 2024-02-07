<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary  border-bottom border-2" style="border-color:#c9c9c9!important">
    <div class="container-fluid">
        <div>
            <span style="font-size:20px;cursor:pointer" class="me-3"  v-show="sidebarbool" @click="$emit('changestate')" >&#9776;</span>
        </div>
    <button class="navbar-toggler mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="">&#9776;</span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <form class="d-block d-md-flex  mx-auto mb-2 mb-lg-0" role="search">
              <div class="form-check form-switch mx-4 my-auto" v-if="searchByDate" style="font-size: 0.8rem !important;" >
                <input class="form-check-input" v-model="switchVal" type="checkbox" role="switch" @change="clearData" id="flexSwitchCheckDefault">
                <label class="form-check-label" style="width: max-content;" for="flexSwitchCheckDefault">by date</label>
              </div>
              
            <VueDatePicker v-model="searchVal.date"  v-if="searchByDate && switchVal" placeholder="pick a date" class="mx-4" text-input auto-apply :enable-time-picker="false" @update:model-value="search()"/>
            <div>
              <input type="search"  v-if="searchByText" placeholder="Search here" style="font-size: 0.8rem !important;" class="search-field px-3 py-1 my-2 " v-model="searchVal.searchValue"  @keyup="search()"/>
            </div>
            <VueDatePicker class=" mx-0 mx-lg-4 my-lg-2 my-2 " v-if="searchByRange && !switchVal" placeholder="select a range" v-model="searchVal.range" range multi-calendars auto-apply :enable-time-picker="false" @update:model-value="search()"/>
        
        </form>

      <ul class="navbar-nav d-flex justify-content-end">
        <li class="nav-item">
        <div>
        <div class="d-flex justify-content-end">
            <div class="btn-group">
              <span  class="border-2 notify rounded-circle" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false" style="padding-inline: 0.6rem !important; height: fit-content; padding-block: 0.30rem !important; background-color:rgb(238, 238, 238)">
                  <i class="bi bi-bell position-relative fs-6">
                      <span v-if="dueDebts.length > 0" class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                      <span class="visually-hidden"></span>
                  </span>
                  </i>
              </span>
              <ul class="dropdown-menu dropdown-menu-end">
                <li v-for="(item, i) in  dueDebts" :key="i" class=""><router-link class="dropdown-item text-muted" :to="{name:'debts'}" style="font-size:13px"><i class="bi bi-dot text-danger"></i>{{`Unpaid Debt to ${item.creditor} due soon`}}</router-link></li>
              </ul>
            </div>

        
            <div class="ms-2 my-auto">
                <p class="text-dark my-0">{{user.username}}</p>
            </div>
            <!-- <img src="../assets/profileImg.jpg" alt="Avatar" class="portfolio-img" style="width:50px; height:50px"> -->
        </div>        
        </div>
        </li>
      </ul>

    </div>
  </div>
</nav>
  </div>
</template>
<script>
import axios from 'axios';

export default {
    emits: ['changestate', 'searchData'],
    props: {
        sidebarbool: Boolean,
        salespoint:Object,
        login:Boolean,
        activeRoute:String
    },
    data() {
      return {
        searchByDate:true,
        searchByText:true,
        searchByRange:true,
        switchVal: false,
        dueDebts:[],
        searchVal:{
          date:null,
          searchValue: null,
          range :null,
        },
        user:[],
        searchRes:[],
        token:null
      }
    },
    created(){
      if(this.login){
          this.token = this.getCookie('token')
          this.getAuth()
          this.getDebtsNotify()
          this.searchMethod(this.activeRoute)
        }
    },
    watch:{
      login(newValue){
        if(newValue){
          this.token = this.getCookie('token')
          this.getAuth()
          this.getDebtsNotify()
        }
      },
      activeRoute(newValue){
        if(newValue){
          this.searchMethod(newValue)
        }
      }
    },
    methods:{
        getAuth(){
            axios.get('http://admin.greatergraceag.com/api/users/auth',
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
              this.user = response.data
            })
            .catch(error =>{
                console.log(error)
            })
        },
        getDebtsNotify(){
          axios.get('http://admin.greatergraceag.com/api/debts/notify',
            { headers:{'Authorization': `Bearer ${this.token}`}})
          .then(response => {
            this.dueDebts = response.data
          })
          .catch(error =>{
              console.log(error)
          })
        },
      search(){
        switch (this.$route.name) {
          case 'incomes':
            this.searchFx('incomes').then(response => {
              this.$emit('searchData', response.data)
            })
            .catch(error => {
              console.error('Error:', error);
            });
          break;
          case 'ledgers':
            this.searchFx('ledgers').then(response => {
                this.$emit('searchData', response.data)
              })
              .catch(error => {
                console.error('Error:', error);
              });
            break;
          case 'debts':
            this.searchFx('debts').then(response => {
              console.log(response.data)
              this.$emit('searchData', response.data)
            })
            .catch(error => {
              console.error('Error:', error);
            });
            break;
          case 'expenses':
              this.searchFx('expenses').then(response => {
                this.$emit('searchData', response.data)
              })
              .catch(error => {
                console.error(error);
              });
            break;
          case 'tithes':
            this.searchFx('tithes').then(response => {
              this.$emit('searchData', response.data)
            })
            .catch(error => {
              console.error('Error:', error);
            });
            break;
            case 'members':
            this.searchFx('members').then(response => {
              this.$emit('searchData', response.data)
            })
            .catch(error => {
              console.error('Error:', error);
            });
            break; 
            case 'dashboard':
            this.searchFx('dashboard').then(response => {
              this.$emit('searchData', response.data)
            })
            .catch(error => {
              console.error('Error:', error);
            });
            break;  
            case 'events':
            this.searchFx('events').then(response => {
              this.$emit('searchData', response.data)
            })
            .catch(error => {
              console.error('Error:', error);
            });
            break;                    
          default:
            console.log('Invalid option.');
        }
      },
      searchMethod(value){
        switch (value) {
          case 'members':
            this.searchByRange = false
            this.searchByDate = false
            this.searchByText = true
          break;
          case 'ledgers':
            this.searchByText = false
            this.searchByDate = false
            this.searchByRange = true
            break;
          case 'records':
            this.searchByDate = false
            this.searchByRange = true
            this.searchByText = false
            break;
          case 'dashboards':
              this.searchByDate = false
              this.searchByText =false
              this.searchByRange = true
            break; 
          case 'events':
              this.searchByDate = false
              this.searchByText = true
              this.searchByRange = true
            break;              
          default:
            this.searchByDate = true
            this.searchByText = true
            this.searchByRange = true
        } 
      },
      async searchFx(routeName){
        let data
        if(this.switchVal){
          data = {
            searchValue: this.simplifyDate(this.searchVal.date),
            startDate:null,
            endDate:null
          }
        }else{
          data = {
            searchValue:this.searchVal.searchValue,
            startDate:this.searchVal.range ? this.simplifyDate(this.searchVal.range[0]) : null,
            endDate:this.searchVal.range ? this.simplifyDate(this.searchVal.range[1]) : null,
          }
        }
        return await axios.post(`http://admin.greatergraceag.com/api/${routeName}/search`, data, 
        { headers:{'Authorization': `Bearer ${this.token}`}})
      },
      simplifyDate(originalDate) {
        const dateObject = new Date(originalDate);
        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObject.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      getCookie(cname) {
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
  }

};
</script>
<style scoped>
.portfolio-img {
  border-radius: 50%;
  object-fit: cover;
}
.notify{
    border: 2px solid rgb(176, 176, 176) ;
}
.dropdown-menu li:hover{
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
}
.dropdown-item.active, .dropdown-item:active {
  background-color: transparent !important;
}
form {
  /* display: flex; */
  flex-direction: row;
}
.search-field {
    background-color: rgb(238, 238, 238);
    border: none;
    width: 3in !important;
    border-radius: 100px;
    outline: none;
}

.search-button {
  background: transparent;
  border: none;
  outline: none;
  margin-left: -33px;
}

.search-button svg {
  width: 20px;
  height: 20px;
  object-fit: cover;
    color: rgb(69, 69, 69);
}
.start-100 {
    left: 80% !important;
}
.top-0 {
    top: 4px !important;
}
.form-check-input:focus {
  border-color: #ffc412 !important;
  outline: 0;
  box-shadow: 0 0 0 .25rem rgba(255, 196, 18, 0.27) !important;
}
.form-check-input:checked {
  background-color: hwb(45 8% 0%);
  border-color: #ffc412;
}
.form-switch .form-check-input:focus {
  --bs-form-switch-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e");
}
</style>
