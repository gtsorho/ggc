<template >
    <div class="container  ">
        <div class="row  p-2">
            <div class=" col mx-2 ">
                <div class="container ">
                    <form class="row border rounded-1  border-warning needs-validation pb-4" >
                        <div class="col-md-3">
                            <label for="inputName1" class="form-label">Attendance</label>
                            <input type="text" required v-model="record.attendance"  class="form-control form-control-sm" id="inputName1" placeholder="256">
                        </div>
                         <div class="col-md-2">
                            <label for="inputName2" class="form-label">VIPs</label>
                            <input type="text" required v-model="record.vips"  class="form-control form-control-sm" id="inputName2" placeholder="14">
                        </div>
                         <div class="col-md-3">
                            <label for="inputName3" class="form-label">Offering</label>
                            <input type="text" required v-model="record.offering"  class="form-control form-control-sm" id="inputName3" placeholder="2456.00">
                        </div>
                         <div class="col-md-3">
                            <label for="inputName4" class="form-label">Tithe</label>
                            <input type="text" required v-model="record.tithe"  class="form-control form-control-sm" id="inputName4" placeholder="925.45">
                        </div>
                        <div class="col-md-3">
                            <label for="inputName5" class="form-label">Seed</label>
                            <input type="text" required v-model="record.seed" class="form-control form-control-sm" id="inputName5" placeholder="1200.00">
                        </div>
                         <div class="col-md-2">
                            <label for="inputName6" class="form-label">ThanksGiving</label>
                            <input type="text" required v-model="record.thanksgiving" class="form-control form-control-sm" id="inputName6" placeholder="650.00">
                        </div>
                         <div class="col-md-2">
                            <label for="inputName7" class="form-label">Welfare</label>
                            <input type="text" v-model="record.welfare"  class="form-control form-control-sm" id="inputName7" placeholder="500.00">
                        </div>
                        <div class="col-md-3">
                            <label for="inputName8" class="form-label">Date</label>
                            <input type="date" v-model="record.date"  class="form-control form-control-sm" id="inputName8">
                        </div>
                         <div class="col-md-12 d-flex align-items-end justify-content-between">
                            <div class="my-2">
                                <button class="btn btn-sm btn-outline-warning" v-if="!update" id="inputName4" type="submit" @click.prevent="createRecord()"  placeholder="john doe">Save</button>
                                <button class="btn btn-sm btn-outline-info mx-1" @click="updateRecord()" v-else id="inputName4"  placeholder="john doe">update</button>
                                <button class="btn btn-sm btn-success" v-if="update" @click="update = false, record={  name:null, location:null,phone:null,phone_two:null,profession:null}" id="inputName4" placeholder="john doe">+</button>
                            </div>
                            <p :class="msgColor" class="text-capitalize my-auto  d-block" style="font-size:13px">{{msg}}</p>
                        </div>
                    </form>
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
                                <th scope="col">Attendance</th>
                                <th scope="col">VIPs</th>
                                <th scope="col">Offering</th>
                                <th scope="col">Tithe</th>
                                <th scope="col">Seed</th>
                                <th scope="col">Welfare</th>
                                <th scope="col">ThanksGiving</th>
                                <th scope="col">Date</th>
                                <th scope="col" class="d-flex justify-content-center ">   
                                    <button class="btn btn-outline-danger btn-sm" v-if="selectAll || selectedItems.length > 0" @click="deleteSelectedItems" ><i class="bi bi-trash3"></i></button>
                                    <i class="bi bi-three-dots" v-else></i>                                 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(record, i) in records" :key="i">
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedItems" :value="record.id"  id="flexCheckDefault">
                                </div>
                                </td>
                                <td>{{i +1}}</td>
                                <td>{{record.attendance}}</td>
                                <td>{{record.vips}}</td>
                                <td>{{record.offering}}</td>
                                <td>{{record.tithe}}</td> 
                                <td>{{record.seed}}</td>
                                <td>{{record.welfare}}</td>
                                <td>{{record.thanksgiving}}</td>
                                <td>{{new Date(record.date).toDateString()}}</td>  
                                <td class="d-flex justify-content-center ">
                                    <button class="btn-outline-warning btn btn-sm m-1" @click="assignRecord(record)"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="deleteRecord(record.id)" ><i class="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>        
                </div>
            </div>
            
            <!-- <div class="col border rounded-1 border-warning">
                <LeftPane/>
            </div> -->
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
            update:false,
            records:[],
            selectedItems: [],
            selectAll: false,
            msgColor:null,
            msg:'',
            record:{
                attendance:null,
                vips:null,
                offering:null,
                tithe:null,
                seed:null,
                welfare:null,
                thanksgiving:null,
                date: new Date().toISOString().split('T')[0],
            },
            token:null
        }
    },
    mounted(){
        this.token = this.getCookie('token')
        if(this.token) this.getRecords()
    },
    methods:{
        selectAllItems() {
            if (this.selectAll) {
                this.selectedItems = this.records.map(record => record.id);
            } else {
                this.selectedItems = [];
            }
        },
        assignRecord(data){
            this.record = data
            this.update = true
        },
        getType(index){
            return this.typeofDept[index]
        },
        createRecord(){
            
            axios.post('http://admin.greatergraceag.com/api/records/', this.record, 
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getRecords()
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
        updateRecord(){
            axios.post('http://admin.greatergraceag.com/api/records/update/'+this.record.id, this.record, 
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getRecords()
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
        deleteRecord(id){
            axios.get('http://admin.greatergraceag.com/api/records/delete/'+ id, 
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getRecords()
            })
            .catch(error =>{
                console.log(error)
            })
        }, 
        deleteSelectedItems() {
            const deletePromises = this.selectedItems.map(id =>
                axios.delete(`http://admin.greatergraceag.com/api/records/delete/${id}`,           
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
        getRecords(){
            axios.get('http://admin.greatergraceag.com/api/records/', 
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.records =  response.data
                console.log(this.records)
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
            this.records = newData
        }else{
            this.getRecords()
        }
        }
    },
}
</script>
<style >
    
</style>