<template >
    <div class="container px-0 mx-0  col cardBg " style="min-height: 100vh; min-width: -moz-available;">
        <div class="container navHead w-100" style="max-width: 100%;">
			<nav class="navbar navbar-expand-lg ftco_navbar ftco-navbar-light" id="ftco-navbar">
		    <div class="container">
                <img  style="width:60px;"  src="../assets/logo.png">
                <h5 class="fw-bolder">Greater Grace Chapel Assemblies of God</h5>
		    	<!-- <div class="social-media order-lg-last">
		    		<p class="mb-0 d-flex">
		    			<a href="#" class="d-flex align-items-center justify-content-center"><span class="fa fa-facebook"><i class="sr-only">Facebook</i></span></a>
		    			<a href="#" class="d-flex align-items-center justify-content-center"><span class="fa fa-twitter"><i class="sr-only">Twitter</i></span></a>
		    			<a href="#" class="d-flex align-items-center justify-content-center"><span class="fa fa-instagram"><i class="sr-only">Instagram</i></span></a>
		    			<a href="#" class="d-flex align-items-center justify-content-center"><span class="fa fa-dribbble"><i class="sr-only">Dribbble</i></span></a>
		    		</p>
	            </div> -->
		      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
		        <span class="fa fa-bars"></span> Menu
		      </button>
		      <!-- <div class="collapse navbar-collapse" id="ftco-nav">
		        <ul class="navbar-nav ml-auto mr-md-3">
		        	<li class="nav-item active"><a href="#" class="nav-link">Home</a></li>
		        	<li class="nav-item"><a href="#" class="nav-link">About</a></li>
		        	<li class="nav-item"><a href="#" class="nav-link">Work</a></li>
		        	<li class="nav-item"><a href="#" class="nav-link">Blog</a></li>
		          <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
		        </ul>
		      </div> -->
		    </div>
		  </nav>
        </div>
        <div class="py-5 mx-auto" style="max-width: 8in;">          
            <div class="">
                <div class="row g-3 pb-2 align-items-center justify-content-center">
                    <div class="col-auto">
                        <label for="inputPassword6" class="col-form-label">Now to</label>
                    </div>
                    <div class="col-3">
                        <input type="number" id="inputPassword6" @change="getUpcoming()" class="form-control form-control-sm" v-model="noDays" aria-describedby="passwordHelpInline">
                    </div>
                    <div class="col-auto ">
                        <span id="passwordHelpInline" class="form-text text-light">
                        days from today
                        </span>
                    </div>
                </div> 
                <div class=" container  d-flex px-3 justify-content-center my-1 ">     
                    <ul class="pagination border-0 border-secondary">
                        <li class="page-item mx-0" :class="{ active: tab === true }"  @click="tab = true">
                            <a class="page-link"   href="#">Upcoming</a>
                        </li>
                        <li class="page-item mx-0" :class="{ active: tab === false }" @click="tab = false">
                            <a class="page-link"    href="#">Recurring</a>
                        </li>

                    </ul> 

                </div> 
                <div class=" container overflow-y-auto mt-2" style=" max-height:70vh" v-if="tab">
                    <div v-for="(event , i) in upcoming" :key="i" class="alert alert-danger shadow py-2" role="alert">
                        <p class="mb-0 text-capitalize fw-bold">{{event.subject}}</p>
                        <small class="">{{new Date(event.start_date).toDateString()}} - {{new Date(event.end_date).toDateString()}}</small>
                    </div>
                    <p class="" :class="upcoming.length == 0 ? 'text-center': 'text-end'" style="font-size:13px;"> You have ({{ upcoming.length }}) upcoming events </p>
                </div>
                <div class=" container overflow-y-auto mt-2" style=" max-height:70vh" v-else>
                    <div v-for="(event , i) in recurring" :key="i" class="alert alert-warning shadow py-2" role="alert">
                        <p class="mb-0 text-capitalize fw-bold">{{event.subject}}</p>
                        <small class="">{{event.description}}</small>
                    </div>
                    <p class="text-end" style="font-size:13px;"> You have ({{ recurring.length }}) recurring events </p>
                </div> 
            </div>
        </div>
    </div>

        <!-- Button trigger modal -->
        <button type="button" ref="errModal" hidden  class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#error">
        Launch demo modal
        </button>

        <!-- Modal -->
        <div class="modal fade" id="error" tabindex="-1" aria-labelledby="errorLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content d-flex">
                    <div class="modal-body d-flex justify-content-between" style="font-size:13px">
                        <p class="text-danger p-0 px-1 m-0 border-2 border-start border-danger border-end">error : {{err}}</p>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import axios from 'axios'
import LeftPane from '../components/leftPane.vue'

export default {
    components: {
        LeftPane
    },
    props: {
        navData:Object
    },
    data() {
        return {
            tab:true,
            total:0,
            noDays:30,
            err:'',
            update:false,
            selectedItems: [],
            selectAll: false,
            msgColor:null,
            msg:'',
            event:{
                subject:null,
                completed:false,
                recurring:false,
                description:null,
                range :[],   
            },
            events:[],
            upcoming:[],
            recurring:[],
            token:null
        }
    },
     mounted(){
        this.token = this.getCookie('token')
        if(this.token) this.getEvents()
    },
    methods:{
        getUpcoming(){
            axios.get('http://admin.greatergraceag.com/api/events/upcoming/'+ this.noDays,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.upcoming = response.data[0]
                this.recurring = response.data[1]
            })
            .catch(error =>{
                this.err = error.response.data
                this.$refs.errModal.click()
            })
        },
        getEvents(){
            this.getUpcoming()
            axios.get('http://admin.greatergraceag.com/api/events/',
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.events = response.data.map(event => {
                    return {
                        ...event,
                        range: [event.start_date, event.end_date]
                    };
                });
            })
            .catch(error =>{
                console.log(error)
            })
        },
        selectAllItems() {
            if (this.selectAll) {
                this.selectedItems = this.events.map(event => event.id);
            } else {
                this.selectedItems = [];
            }
        },
        assignEvent(data){
            this.event = data
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
    },
    watch:{
        navData(newData, oldData){
            if(newData || newData != null){
                this.events = newData
            }else{
                this.getEvents()
            }
        }
    },
}
</script>
<style >
    .nav-item .active{
        background: #ffc412 !important;
        color: #fff !important;
    }
    .nav-item a{
        color: #ffffff !important;
    }
    

    .pagination-outer {
            text-align: center;
        }

        .pagination {
            background-color: #fff;
            border-radius: 5px !important;
            overflow: hidden;
            border: none !important;
        }

        a:focus,
        a:active {
            outline: none !important;
            box-shadow: none !important;
            color: #fff;
        }
        
        .fa {
            font-size: 11px ;
            vertical-align: middle !important;
            color: black;
        }

        .pagination li.active .fa {
            color: #fff !important;
        }

        .pagination li a.page-link {
            color: #6e6e6e;
            background-color: transparent;
            font-size: 13px;
            padding: 3px 15px;
            border: none;
            transition: all 0.3s ease 0s;
        }

        .fa-home {
            transform: scale(1.4, 1.4) ;
        }

        .pagination li:last-child a.page-link {
            border: none;
        }

        .pagination li.active a.page-link,
        .pagination li a.page-link:hover,
        .pagination li.active a.page-link:hover {
            background-color: transparent;
            color: #fff;
        }

        .pagination li a.page-link:after {
            content: '';
            background-color: #01223e !important;
            height: 100%;
            width: 100%;
            color: #fff;
            transform: scaleY(0);
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: -1;
            transition: all 0.3s;
        }

        .pagination li.active a.page-link:after,
        .pagination li a.page-link:hover:after,
        .pagination li.active a.page-link:hover:after {
            transform: scaleY(1);
            border-radius: 5px !important;

        }      
        @media (max-width: 767px) {
          
        .pagination li a.page-link {            
            padding: 11px 8px !important;
          } 

        .fa{
            font-size: 9px !important;
          }

        li a {
            font-size: 12px !important;
        }
        
        .page-item+.page-item {
            padding-left: 0 !important;
        }
      }
      .navHead{
        background: #ffffff1c;
      }
</style>
