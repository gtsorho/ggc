<template >
    <div class="container  ">
        <div class="row  p-2">
            <div class=" col-md-8 mx-2 ">
                <div class="container ">
                    <div class="row border rounded-1  border-warning needs-validation pb-4" >
                        <div class="col-md-6">
                            <label for="inputName4" class="form-label">Amount</label>
                            <input type="text" required v-model="expense.amount" class="form-control form-control-sm" id="inputName4" placeholder="256.00">
                        </div>
                        <div class="col-md-6">
                            <label for="inputName4" class="form-label">Type of Expense</label>
                            <select v-model="expense.category" class="form-select form-select-sm" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option v-for="(value, i) in category" :key="i"  :value="value">{{value}}</option>
                            </select>                        
                        </div>
                         <div class="col-md-6">
                            <label for="inputName4" class="form-label">Description</label>
                            <input type="text" v-model="expense.description" required  class="form-control form-control-sm" id="inputName4" placeholder="lorem ipsum init">
                        </div>
                         <div class="col-md-4">
                            <label for="inputName4" class="form-label">Date</label>
                            <input type="date" v-model="expense.date" required  class="form-control form-control-sm" id="inputName4" >
                        </div>
                         <div class="col-md-12 d-flex justify-content-between align-items-end ">
                            <div>
                                <button class="btn btn-sm btn-outline-warning" id="inputName4"  v-if="!update" type="submit" @click="createExpense()">Save</button>
                                <button class="btn btn-sm btn-outline-primary mx-1" v-if="update" @click="updateExpense" id="inputName4" placeholder="john doe">Update</button>
                                <button class="btn btn-sm btn-success" v-if="update" @click="update = false, expense = {amount:0, date:null, memberId:null}" id="inputName4" placeholder="john doe">+</button>
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
                                <th scope="col">Amount</th>
                                <th scope="col">Type Trans</th>
                                <th scope="col">description</th>
                                <th scope="col">date</th>
                                <th scope="col" >
                                    <button v-if="expenses.filter(expense => expense.merged === false).length > 0"  @click="merge()" class="btn btn-sm rounded-pill p-0 btn-outline-danger"><i class="bi bi-arrow-repeat"></i></button>
                                    <span v-else ><i class="bi bi-arrow-repeat text-success"></i></span>
                                </th>
                                <th scope="col" class=" d-flex justify-content-center ">   
                                    <button class="btn btn-outline-danger btn-sm" v-if="selectAll || selectedItems.length > 0" @click="deleteSelectedItems" ><i class="bi bi-trash3"></i></button>
                                    <i class="bi bi-three-dots" v-else></i>                                 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(expense, i) in expenses" :key="i">
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedItems" :value="expense.id"  id="flexCheckDefault">
                                </div>
                                </td>
                                <td>{{i +1}}</td>
                                <td>{{parseFloat(expense.amount).toFixed(2)}}</td>
                                <td>{{expense.category}}</td>
                                <td>{{expense.description}}</td>
                                <td>{{new Date(expense.date).toDateString()}}</td>
                                <td>
                                    <i v-if="expense.merged" class="bi bi-check-circle-fill text-success"></i>
                                    <i v-else class="bi bi-x-circle-fill text-danger" ></i>
                                </td> 
                                <td class=" d-flex justify-content-center ">
                                    <button class="btn-outline-warning btn btn-sm m-1" @click="assignExpense(expense), update = true"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="deleteItem(expense.id)" ><i class="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>        
                </div>
            </div>
            
            <div class="col border rounded-1 border-warning">
                <LeftPane>
                    <i class="bi bi-star-half mx-2"></i>Expense Total is GH₵ {{total.toFixed(2)}}<i class="bi bi-star-half mx-2"></i>
                </LeftPane>
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
            total:0,
            err:'',
            update:false,
            selectedItems: [],
            selectAll: false,
            msgColor:null,
            msg:'',
            expense:{
                amount:null,
                date:null,
                description:null,
                category:null
            },
            expenses:[],
            category:[
                'religious', 'school', 'individual', 'financial', 'bill'
            ],
            token:null
        }
    },
     mounted(){
        this.token = this.getCookie('token')
        if(this.token) this.getExpenses()
    },
    methods:{
        createExpense(){
            axios.post('http://ggc.pangtresses.com/api/expenses/', this.expense,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getExpenses()
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
            axios.get('http://ggc.pangtresses.com/api/expenses/merge/',
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getExpenses()
            })
            .catch(error =>{
                this.err = error.response.data
                this.$refs.errModal.click()
            })
        },
        getExpenses(){
            axios.get('http://ggc.pangtresses.com/api/expenses/',
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.expenses =  response.data
                this.total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
            })
            .catch(error =>{
                console.log(error)
            })
        },
        selectAllItems() {
            if (this.selectAll) {
                this.selectedItems = this.expenses.map(expense => expense.id);
            } else {
                this.selectedItems = [];
            }
        },
        assignExpense(data){
            this.expense = data
        },
        updateExpense(){
            axios.post('http://ggc.pangtresses.com/api/expenses/update/' + this.expense.id,  this.expense,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getExpenses()
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
                axios.delete(`http://ggc.pangtresses.com/api/expenses/delete/${id}`,
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
            axios.get('http://ggc.pangtresses.com/api/expenses/delete/'+ id,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getExpenses()
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
            this.expenses = newData
            this.total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        }else{
            this.getExpenses()
        }
        }
    },
}
</script>
<style >
    
</style>