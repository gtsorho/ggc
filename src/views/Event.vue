<template >
    <div class="container  ">
        <div class="row  p-2">
            <div class=" col-md-8 mx-2 ">
                <div class="container ">
                    <div class="row border rounded-1  border-warning needs-validation pb-4" >
                        <div class="col-md-6">
                            <label for="inputName4" class="form-label">Event</label>
                            <input type="text" required v-model="event.subject" class="form-control form-control-sm" id="inputName4" placeholder="Women Ministry week ">
                        </div>
                         <div class="col-md-6">
                            <label for="inputName4" class="form-label">Description</label>
                            <input type="text" v-model="event.description" required  class="form-control form-control-sm" id="inputName4" placeholder="lorem ipsum init">
                        </div>
                         <div class="col-md-6">
                            <label for="inputName4" class="form-label">Date</label>
                            <VueDatePicker class=" mx-0 mx-lg-0  my-lg-2 my-2 " placeholder="select a range" v-model="event.range" range multi-calendars auto-apply :enable-time-picker="false"/>
                        </div>                        
                        <div class="form-check pb-2 col-md-6 d-flex align-items-end">
                            <input class="form-check-input mb-1 ms-1 me-3" type="checkbox" v-model="event.completed" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                event is completed
                            </label>
                        </div>
                         <div class="col-md-12 d-flex justify-content-between align-items-end ">
                            <div>
                                <button class="btn btn-sm btn-outline-warning" id="inputName4"  v-if="!update" type="submit" @click="createEvent()">Save</button>
                                <button class="btn btn-sm btn-outline-primary mx-1" v-if="update" @click="updateEvent" id="inputName4" placeholder="john doe">Update</button>
                                <button class="btn btn-sm btn-success" v-if="update" @click="update = false, event = {amount:0, date:null, memberId:null}" id="inputName4" placeholder="john doe">+</button>
                            </div>
                            <p :class="msgColor" class="text-capitalize my-auto  d-block" style="font-size:13px">{{msg}}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-responsive my-3"  style="max-height:4in">
                        <table class="table table-hover " style="font-size:14px">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 20px;"> 
                                    <input class="form-check-input"  type="checkbox" v-model="selectAll" @change="selectAllItems" id="flexCheckDefault">
                                </th>
                                <th scope="col">#</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Description</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Completed</th>
                                <th scope="col" class=" d-flex justify-content-center ">   
                                    <button class="btn btn-outline-danger btn-sm" v-if="selectAll || selectedItems.length > 0" @click="deleteSelectedItems" ><i class="bi bi-trash3"></i></button>
                                    <i class="bi bi-three-dots" v-else></i>                                 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(event, i) in events" :key="i">
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedItems" :value="event.id"  id="flexCheckDefault">
                                </div>
                                </td>
                                <td>{{i +1}}</td>
                                <td>{{event.subject}}</td>
                                <td>{{event.description}}</td>
                                <td>{{new Date(event.start_date).toDateString()}}</td>
                                <td>{{new Date(event.end_date).toDateString()}}</td>
                                <td>
                                    <i v-if="event.completed" class="bi bi-check-circle-fill text-success"></i>
                                    <i v-else class="bi bi-x-circle-fill text-danger" ></i>
                                </td> 
                                <td class=" d-flex justify-content-center ">
                                    <button class="btn-outline-warning btn btn-sm m-1" @click="assignEvent(event), update = true"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="deleteItem(event.id)" ><i class="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>        
                </div>
            </div>
            
            <div class="col border rounded-1 p-2  border-danger">
                <div class="row g-3 pb-2 align-items-center">
                    <div class="col-auto">
                        <label for="inputPassword6" class="col-form-label">Now to</label>
                    </div>
                    <div class="col-3">
                        <input type="number" id="inputPassword6" @change="getUpcoming()" class="form-control form-control-sm" v-model="noDays" aria-describedby="passwordHelpInline">
                    </div>
                    <div class="col-auto">
                        <span id="passwordHelpInline" class="form-text">
                        days from today
                        </span>
                    </div>
                </div>  
                <ul class="nav nav-pills nav-fill d-flex px-3 justify-content-center my-1" style="font-size:13px">
                    <li class="nav-item"  @click="tab = true">
                        <a class="nav-link " :class="tab ? 'active' : ''" href="#">Upcoming</a>
                    </li>
                    <li class="nav-item" @click="tab = false">
                        <a class="nav-link  " :class="!tab ? 'active' : ''"  href="#">Recurring</a>
                    </li>
                </ul> 
                <div class=" container overflow-y-auto" style=" max-height:5in" v-if="tab">
                    <div v-for="(event , i) in upcoming" :key="i" class="alert alert-danger shadow" role="alert">
                        <p class="mb-0 text-capitalize fw-bold">{{event.subject}}</p>
                        <small class="">{{new Date(event.start_date).toDateString()}} - {{new Date(event.end_date).toDateString()}}</small>
                    </div>
                </div>
                <div class=" container overflow-y-auto" style=" max-height:5in" v-else>
                    <div v-for="(event , i) in recurring" :key="i" class="alert alert-warning shadow" role="alert">
                        <p class="mb-0 text-capitalize fw-bold">{{event.subject}}</p>
                        <small class="">{{event.description}}</small>
                    </div>
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
        createEvent(){
            let data = {
                subject:this.event.subject,
                completed:this.event.completed,
                description:this.event.description,
                start_date : this.event.range[0],
                end_date : this.event.range[1]
            }

            axios.post('http://ggc.pangtresses.com/api/events/', data,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getEvents()
                })
            .catch(error =>{
                this.msg = error.response.data
				this.msgColor = 'text-danger'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
                // console.log(error)
            })
        },
        getUpcoming(){
            axios.get('http://ggc.pangtresses.com/api/events/upcoming/'+ this.noDays,
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
            axios.get('http://ggc.pangtresses.com/api/events/',
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
        updateEvent(){
            let data = {
                subject:this.event.subject,
                completed:this.event.completed,
                description:this.event.description,
                start_date : this.event.range[0],
                end_date : this.event.range[1]
            }

            axios.post('http://ggc.pangtresses.com/api/events/update/' + this.event.id, data,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getEvents()
                })
            .catch(error =>{
                this.msg = error.response.data
				this.msgColor = 'text-danger'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
            })
        },
        deleteSelectedItems() {
            const deletePromises = this.selectedItems.map(id =>
                axios.delete(`http://ggc.pangtresses.com/api/events/delete/${id}`,
                 { headers:{'Authorization': `Bearer ${this.token}`}})
            );
            Promise.all(deletePromises)
            .then(responses => {
            console.log('Items deleted successfully', responses);
            })
            .catch(error => {
            console.error('Error deleting items', error);
            }); 
        },
         deleteItem(id){
            axios.get('http://ggc.pangtresses.com/api/events/delete/'+ id,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getEvents()
            })
            .catch(error =>{
                console.log(error)
            })
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
        color: #000 !important;
    }
    
</style>