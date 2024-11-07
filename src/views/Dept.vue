<template >
    <div class="container-fluid ps-0  mx-0 ">
        <div class="row py-2">
            <div class=" col-12 col-md-8">
                <div class="container ">
                    <div class="row border cardBg needs-validation p-4"  >
                         <div class="col-md-6">
                            <label for="inputName4" class="form-label">Individual/Organization</label>
                            <input type="text" required v-model="debt.creditor" class="form-control form-control-sm" id="inputName4" placeholder="Rent">
                        </div>
                        <div class="col-md-6">
                            <label for="inputName4" class="form-label">Category</label>
                            <select class="form-select form-select-sm" v-model="debt.category" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option v-for="(value, i) in category" :key="i"  :value="value">{{value}}</option>
                            </select>
                        </div>
                         <div class="col-md-4">
                            <label for="inputName4" class="form-label">Due Date</label>
                            <input type="date" required v-model="debt.due" class="form-control form-control-sm" id="inputName4" >
                        </div>
                         <div class="col-md-3">
                            <label for="inputName4" class="form-label">Amount</label>
                            <input type="text" required v-model="debt.amount" class="form-control form-control-sm" id="inputName4" placeholder="523.00">
                        </div>
                        <div class="col-md-3">
                            <label for="inputName4" class="form-label">Paid</label>
                            <input type="text" required v-model="debt.paid" class="form-control form-control-sm" id="inputName4" placeholder="12.5">
                        </div>
                        <div class="col-md-12 d-flex justify-content-between align-items-end my-2">
                           <div>
                                <button class="btn btn-sm btn-outline-warning" id="inputName4" v-if="!update" @click="createDebt">Save</button>
                                <button class="btn btn-sm btn-outline-primary mx-1" v-if="update" @click="updateDebt" id="inputName4" placeholder="john doe">Update</button>
                                <button class="btn btn-sm btn-success" v-if="update" @click="update = false, debt = {amount:null, date:null, category:null}" id="inputName4" placeholder="john doe">+</button>
                           </div>
                           <p :class="msgColor" class="text-capitalize my-auto  d-block" style="font-size:13px">{{msg}}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-responsive my-3 cardBg px-2" style="max-height:70vh">
                        <table class="table-hover w-100" style="font-size:14px">
                        <thead class="sticky-top top-0">
                            <tr>
                                <th scope="col" style="width: 20px;"> 
                                    <input class="form-check-input"  type="checkbox" v-model="selectAll" @change="selectAllItems" id="flexCheckDefault">
                                </th>
                                <th scope="col">Indv/Org</th>
                                <th scope="col">Category</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Due Date</th>
                                <th scope="col">Paid</th>
                                <th scope="col">Balance</th>
                                <th scope="col" >
                                    <button v-if="debts.filter(debt => debt.merged === false).length > 0" @click="merge()" class="btn btn-sm rounded-pill p-0 btn-outline-danger">
                                        <i class="bi bi-arrow-repeat"></i>
                                    </button>
                                    <span v-else ><i class="bi bi-arrow-repeat text-success"></i></span>
                                </th>
                                <th scope="col" class="  ">   
                                    <button class="btn btn-outline-danger btn-sm" v-if="selectAll || selectedItems.length > 0" @click="deleteSelectedItems" ><i class="bi bi-trash3"></i></button>
                                    <i class="bi bi-three-dots" v-else></i>                                 
                                </th>                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(debt, i) in debts" :key="i">
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedItems" :value="debt.id"  id="flexCheckDefault">
                                </div>
                                </td>
                                <td>{{debt.creditor}}</td>
                                <td>{{debt.category}}</td>
                                <td>{{parseFloat(debt.amount).toFixed(2)}}</td>
                                <td>{{new Date(debt.due).toDateString()}}</td> 
                                <td>{{parseFloat(debt.paid).toFixed(2)}}</td>  
                                <td>{{debt.balance.toFixed(2)}}</td> 
                                <td >
                                    <i v-if="debt.merged" class="bi bi-check-circle-fill text-success"></i>
                                    <i v-else class="bi bi-x-circle-fill  text-danger" ></i>
                                </td> 
                                <td class="">
                                    <button class="btn-outline-warning btn btn-sm m-1" @click="assignDebt(debt), update = true"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="deleteItem(debt.id)" ><i class="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>        
                </div>
            </div>
            
            <div class="col cardBg">
                <LeftPane :totalAmount="total"/>
            </div>
        </div>
    </div>

    <!-- Button trigger modal -->
        <button type="button" ref="errModal" hidden  class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#error">
        Launch demo modal
        </button>

        <!-- Modal -->
        <div class="modal fade" id="error" tabindex="-1" aria-labelledby="errorLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
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
            total:0,
            err:'',
            msgColor:null,
            msg:'',
            update:false,
            debts:[],
            selectedItems: [],
            selectAll: false,
            debt:{
                amount:null,
                category:null,
                creditor:null,
                due:null,
                paid:null,
            },
            category:[
                'dues', 'rent', 'utilities', 'project', 'allowance'
            ],
            token:null
        }
    },
    mounted(){
        this.token = this.getCookie('token')
        if(this.token) this.getDebts()
    },
    methods:{
        assignDebt(data){
            this.debt = data
        },
        selectAllItems() {
            if (this.selectAll) {
                this.selectedItems = this.debts.map(debt => debt.id);
            } else {
                this.selectedItems = [];
            }
        },
        createDebt(){
            axios.post('http://admin.greatergraceag.com/api/debts/', this.debt,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getDebts()
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
            axios.get('http://admin.greatergraceag.com/api/debts/merge/',
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getDebts()
            })
            .catch(error => {
                this.err = error.response.data
                this.$refs.errModal.click()
            })
        },
        getDebts(){
            axios.get('http://admin.greatergraceag.com/api/debts/',
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.debts =  response.data[0]
            })
            .catch(error =>{
                console.log(error)
            })
        },
        updateDebt(){
            axios.post('http://admin.greatergraceag.com/api/debts/update/' + this.debt.id,  this.debt,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getDebts()
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
                axios.delete(`http://admin.greatergraceag.com/api/debts/delete/${id}`,
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
            axios.get('http://admin.greatergraceag.com/api/debts/delete/'+ id,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                console.log(response.data)
                this.getDebts()
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
            this.debts = newData
        }else{
            this.getDebts()
        }
        }
    },

}
</script>
<style >
    
</style>
