<template >
    <div class="container  ">
        <div class="row  p-2">
            <div class=" col-4 mx-2 ">
                <div class="container ">
                    <form class="row border rounded-1  border-warning needs-validation pb-4" @submit.prevent="createUser"   >
                        <div class="col-md-12">
                            <label for="inputName4" class="form-label">Username</label>
                            <input type="text" required v-model="user.username"  class="form-control form-control-sm" id="inputName4" placeholder="johndoe">
                        </div>
                        <div class="col-md-12">
                            <label for="inputName4" class="form-label">Password</label>
                            <input type="password" required v-model="user.password" class="form-control form-control-sm" id="inputName4" placeholder="*********">
                        </div>
                        <div class="col-md-12" v-if="!update">
                            <label for="inputName4" class="form-label">Confirm Password</label>
                            <input type="password" required v-model="user.repeat_password" class="form-control form-control-sm" id="inputName5" placeholder="**********">
                        </div>
                         <div class="col-md-2 p-2 d-flex align-items-end ">
                            <button class="btn btn-sm btn-outline-warning" v-if="!update" id="inputName4" type="submit"  placeholder="john doe">Save</button>
                            <button class="btn btn-sm btn-outline-info mx-1" @click="updateUser" v-else id="inputName4"  placeholder="john doe">update</button>
                            <button class="btn btn-sm btn-success" v-if="update" @click="update = false, user={ username:null, password:null, repeat_password:null}" id="inputName4" placeholder="john doe">+</button>
                        </div>
                    </form>
                </div>
                <div>
                    <div class="table-responsive my-3">
                        <table class="table table-hover " style="font-size:14px">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 20px;"> 
                                    <input class="form-check-input"  type="checkbox" v-model="selectAll" @change="selectAllItems" id="flexCheckDefault">
                                </th>
                                <th scope="col">#</th>
                                <th scope="col">Username</th>
                                <th scope="col" class="d-flex justify-content-center ">   
                                    <button class="btn btn-outline-danger btn-sm" v-if="selectAll || selectedItems.length > 0" @click="deleteSelectedItems" ><i class="bi bi-trash3"></i></button>
                                    <i class="bi bi-three-dots" v-else></i>                                 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, i) in users" :key="i">
                                <td>
                                    <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="selectedItems" :value="user"  id="flexCheckDefault">
                                </div>
                                </td>
                                <td>{{i +1}}</td>
                                <td>{{user.username}}</td>
                                <td class="d-flex justify-content-center ">
                                    <button class="btn-outline-warning btn btn-sm m-1" @click="assignUser(user)"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="deleteUser(user.id)" ><i class="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>        
                </div>
            </div>
            
            <div class="col ">
                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Ledger Heads
                        </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <form class="row border rounded-1  border-warning needs-validation pb-4" @submit.prevent="createLedger"   >
                                <div class="col-md-12">
                                    <label for="inputName4" class="form-label">Ledger Title</label>
                                    <input type="text" required v-model="ledgerhead.title" class="form-control form-control-sm" id="inputName4" placeholder="GGC_Ledger_2024">
                                </div>
                                <div class="col-md-6">
                                    <label for="inputName4" class="form-label">Account Name</label>
                                    <input type="text" required v-model="ledgerhead.account_name"  class="form-control form-control-sm" id="inputName4" placeholder="GGC A/G">
                                </div>
                                <div class="col-md-6">
                                    <label for="inputName4" class="form-label">Account Number</label>
                                    <input type="text" required v-model="ledgerhead.account_no" class="form-control form-control-sm" id="inputName4" placeholder="12200114588996">
                                </div>
                                <div class="col-md-6">
                                    <label for="inputName4" class="form-label">Starting Balance</label>
                                    <input type="text" required v-model="ledgerhead.start_bal" class="form-control form-control-sm" id="inputName5" placeholder="2300">
                                </div>
                                <div class="col-md-6 d-flex py-4 justify-content-center">
                                    <div class="form-check form-switch mx-auto"  style="font-size: 0.8rem !important;" >
                                        <div class="my-auto">
                                            <input class="form-check-input" v-model="ledgerhead.active" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                                            <label class="form-check-label" style="width: max-content;" for="flexSwitchCheckDefault">Set as active</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2 p-2 d-flex align-items-end ">
                                    <button class="btn btn-sm btn-outline-warning" v-if="!updateHead" id="inputName4" type="submit"  placeholder="john doe">Save</button>
                                    <button class="btn btn-sm btn-outline-info mx-1" @click="updateLedgerHead" v-else id="inputName4"  placeholder="john doe">update</button>
                                    <button class="btn btn-sm btn-success" v-if="updateHead" @click="updateHead = false, ledgerhead={ title:null, account_name:null, account_no:null, start_bal:null, active:false}" id="inputName4" placeholder="john doe">+</button>
					                <p :class="msgColor" class="text-capitalize" style="font-size:13px">{{msg}}</p>
                                </div>
                            </form>
                        </div>
                            <div class="container-fluid p-3">
                                <span class="badge rounded-pill text-bg-secondary m-1" v-for="(ledgerhead, i) in ledgerheads" :key="i" > <span style="cursor: pointer"  class="badge text-bg-warning" @click="assignLedgerHead(ledgerhead)">{{ledgerhead.title}}</span> <span style="cursor: pointer"  class="badge text-bg-danger" @click="deleteLedgerHead(ledgerhead.id)">Del</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                        <button class="accordion-button collapsed" disabled type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Settings
                        </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                        <button class="accordion-button collapsed" disabled type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Expense
                        </button>
                        </h2>
                        <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Messaging from '../components/messaging.vue'

export default {
    components: {
        Messaging
    },
      props: {
    navData:Object
  },
    data() {
        return {
            update:false,
            updateHead:false,
            users:[],
            selectedItems: [],
            msgColor:null,
            msg:'',
            selectAll: false,
            user:{
                user:null,
                password:null,
                repeat_password:null,
            },
            ledgerhead:{
                account_name:null,
                account_no:null,
                title:null,
                start_bal:null,
                active:false,
            },
            ledgerheads: [],
            token:null
        }
    },
    created(){
        this.token = this.getCookie('token')
        if(this.token){
            this.getLedgerHeads()
            this.getUsers()
        }
    },
    methods:{
        selectAllItems() {
            if (this.selectAll) {
                this.selectedItems = this.users.map(user => user);
            } else {
                this.selectedItems = [];
            }
        },
        assignUser(data){
            this.user = data
            this.update = true
        },
        assignLedgerHead(data){
            this.ledgerhead = data
            this.updateHead = true
        },
        getType(index){
            return this.typeofDept[index]
        },
        createUser(e){
            e.preventDefault();
            
            axios.post('http://ggc.pangtresses.com/api/users/', this.user,
                { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getUsers()
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
        createLedger(e){
            e.preventDefault();
            delete this.ledgerhead.active
            axios.post('http://ggc.pangtresses.com/api/ledgers/ledgerhead', this.ledgerhead,
                { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getUsers()
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
        updateUser(){
            axios.post('http://ggc.pangtresses.com/api/users/update/'+ this.user.id, this.user,
                      { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getUsers()
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
        deleteUser(id){
            axios.get('http://ggc.pangtresses.com/api/users/delete/'+ id,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getUsers()
            })
            .catch(error =>{
                console.log(error)
            })
        },
        updateLedgerHead(){
            axios.post('http://ggc.pangtresses.com/api/ledgers/ledgerhead/update/'+ this.ledgerhead.id, this.ledgerhead,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getLedgerHeads()
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
        deleteLedgerHead(id){
            axios.get('http://ggc.pangtresses.com/api/ledgers/ledgerhead/delete/'+ id,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getLedgerHeads()
            })
            .catch(error =>{
                console.log(error)
            })
        },

        deleteSelectedItems() {
            const deletePromises = this.selectedItems.map(user =>
                axios.delete(`http://ggc.pangtresses.com/api/users/delete/${user.id}`,           
                { headers:{'Authorization': `Bearer ${this.token}`}}));
            Promise.all(deletePromises)
            .then(responses => {
            console.log('Items deleted successfully', responses);
            })
            .catch(error => {
            console.error('Error deleting items', error);
            });
        },
        getUsers(){
            axios.get('http://ggc.pangtresses.com/api/users/',
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.users =  response.data
            })
            .catch(error =>{
                console.log(error)
            })
        },
        getLedgerHeads(){
            axios.get('http://ggc.pangtresses.com/api/ledgers/ledgerheads',
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.ledgerheads =  response.data
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
                this.users = newData
            }else{
                this.getUsers()
            }
        }
    },
}
</script>
<style >
    
</style>