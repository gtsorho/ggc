<template >
    <div class="container ps-0 mx-0 ">
        <div class="row  py-2">
            <div class=" col-12 col-lg-8">
                <div class="container ">
                    <div class="row cardBg needs-validation py-2">
                        <div class="col-md-4">
                            <label for="inputName4" class="form-label">Member</label>
                            <select class="form-select form-select-sm" v-model="tithe.memberId" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option v-for="(member, i) in members" :key="i"  :value="member.id">{{member.name}}</option>
                            </select>                        </div>
                         <div class="col-md-3">
                            <label for="inputName4" class="form-label">Amount</label>
                            <input type="text" required v-model="tithe.amount" class="form-control form-control-sm" id="inputName4" placeholder="100.22">
                        </div>
                         <div class="col-md-3">
                            <label for="inputName4" class="form-label">Date</label>
                            <input type="date" v-model="tithe.date" required  class="form-control form-control-sm" id="inputName4" placeholder="john doe">
                        </div>
                         <div class="col-md-12 d-flex align-items-end justify-content-between my-2 ">
                            <div>
                                <button class="btn btn-sm btn-outline-warning" v-if="!update" id="inputName4" @click="createTithe" type="submit" >Save</button>
                                <button class="btn btn-sm btn-outline-primary mx-1" v-if="update" @click="updateTithe" id="inputName4" placeholder="john doe">Update</button>
                                <button class="btn btn-sm btn-success" v-if="update" @click="update = false, tithe = {amount:0, date:null, memberId:null}" id="inputName4" placeholder="john doe">+</button>
                            </div>
                            <p :class="msgColor" class="text-capitalize my-auto  d-block" style="font-size:13px">{{msg}}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-responsive mt-3 cardBg"  style="max-height:70vh">
                        <table class="w-100 table-hover" style="font-size:14px">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 20px;"> 
                                    <input class="form-check-input"  type="checkbox" v-model="selectAll" @change="selectAllItems" id="flexCheckDefault">
                                </th>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Date</th>
                                <th scope="col">Created At</th>
                                <th scope="col" >
                                    <button v-if="tithes.filter(tithe => tithe.merged === false).length > 0"  @click="merge()" class="btn btn-sm rounded-pill p-0 btn-outline-danger"><i class="bi bi-arrow-repeat"></i></button>
                                    <span v-else ><i class="bi bi-arrow-repeat text-success"></i></span>
                                </th>
                                <th scope="col" class=" d-flex justify-content-center ">   
                                    <button class="btn btn-outline-danger btn-sm" v-if="selectAll || selectedItems.length > 0" @click="deleteSelectedItems" ><i class="bi bi-trash3"></i></button>
                                    <i class="bi bi-three-dots" v-else></i>                                 
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="tithes.length > 0">
                            <tr v-for="(tithe, i) in tithes" :key="i">
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedItems" :value="tithe.id"  id="flexCheckDefault">
                                    </div>
                                </td>
                                <td>{{i +1}}</td>
                                <td>{{tithe.member.name}}</td>
                                <td>{{parseFloat(tithe.amount).toFixed(2)}}</td>
                                <td>{{new Date(tithe.date).toDateString()}}</td>
                                <td>{{new Date(tithe.createdAt).toLocaleString("en-GB")}}</td>
                                <td>
                                    <i v-if="tithe.merged" class="bi bi-check-circle-fill text-success"></i>
                                    <i v-else class="bi bi-x-circle-fill text-danger" ></i>
                                </td>                                
                                <td class=" d-flex justify-content-center ">
                                    <button class="btn-outline-warning btn btn-sm m-1" @click="assignTithe(tithe), update = true"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="deleteItem(tithe.id)" ><i class="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>        
                </div>
            </div>
            
            <div class="col-sm-12 col-lg-4 cardBg">
                <LeftPane>
                    <i class="bi bi-star-half mx-2"></i> Total Tithe is GH₵ {{parseFloat(total).toFixed(2)}} and  20% is GH₵{{(parseFloat(total) * 0.2).toFixed(2)}}<i class="bi bi-star-half mx-2"></i>
                </LeftPane>
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
            update:false,
            members:[],
            selectedItems: [],
            selectAll: false,
            msgColor:null,
            msg:'',
            tithe:{
                memberId:null,
                amount:0,
                date:null
            },
            tithes:[],
            token:null
        }
    },
     mounted(){
        this.token = this.getCookie('token')
        if(this.token) {
            this.getMembers()
            this.getTithes()
        }
    },
    methods:{
         selectAllItems() {
            if (this.selectAll) {
                this.selectedItems = this.tithes.map(tithe => tithe.id);
            } else {
                this.selectedItems = [];
            }
        },
        assignTithe(data){
            this.tithe = data
        },
        createTithe(){
            axios.post('http://admin.greatergraceag.com/api/tithes/', this.tithe,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getTithes()
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
        merge(){
            axios.get('http://admin.greatergraceag.com/api/tithes/merge/',
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getTithes()
            })
            .catch(error =>{
                console.log(error)
            })
        },
        getTithes(){
            axios.get('http://admin.greatergraceag.com/api/tithes/',
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.tithes =  response.data.reverse()
            })
            .catch(error =>{
                console.log(error)
            })
        },
        getMembers(){
            axios.get('http://admin.greatergraceag.com/api/members/',
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.members =  response.data
            })
            .catch(error =>{
                console.log(error)
            })
        },
        updateTithe(){
            console.log(this.tithe)
            axios.post('http://admin.greatergraceag.com/api/tithes/update/' + this.tithe.id,  this.tithe,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getTithes()
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
        deleteSelectedItems() {
            const deletePromises = this.selectedItems.map(id =>
                axios.delete(`http://admin.greatergraceag.com/api/tithes/delete/${id}`,
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
            axios.get('http://admin.greatergraceag.com/api/tithes/delete/'+ id,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getTithes()
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
            this.tithes = newData
        }else{
            this.getTithes()
        }
        }
    },
    computed:{
        total(){
            return this.tithes.reduce((sum, tithe) => sum + tithe.amount, 0);
        }
    },

}
</script>
<style >
    
</style>