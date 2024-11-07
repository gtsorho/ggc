<template >
    <div class="container ps-0 mx-0 ">
        <div class="row py-3">
            <div class=" col-md-12 col-lg-8 ">
                <div class="container ">
                    <div class="row cardBg needs-validation py-2" >
                        <div class="col-md-3">
                            <label for="inputName4" class="form-label">Amount</label>
                            <input type="text" required v-model="income.amount" class="form-control form-control-sm" id="inputName4" placeholder="500.00">
                        </div>
                        <div class="col-md-3">
                            <label for="inputName4" class="form-label">Date</label>
                            <input type="date" v-model="income.date" required  class="form-control form-control-sm" id="inputName4" placeholder="john doe">
                        </div>
                        <div class="col-md-4">
                                <label for="inputName4" class="form-label">Category</label>
                                <select v-model="income.category" class="form-select form-select-sm" aria-label="Default select example">
                                    <option selected>Open this select menu</option>
                                    <option v-for="(value, i) in category" :key="i"  :value="value">{{value}}</option>
                                </select>
                            </div>
                        <div class="col-md-12 d-flex justify-content-between align-items-end my-2 ">
                            <div>
                                <button style="width:1in" class="btn btn-sm btn-outline-warning" v-if="!update" @click="createIncome"  type="submit" id="inputName4" placeholder="john doe">Save</button>
                                <button style="width:1in" class="btn btn-sm btn-outline-primary mx-1" v-if="update" @click="updateIncome" id="inputName4" placeholder="john doe">Update</button>
                                <button style="width:1in" class="btn btn-sm btn-success" v-if="update" @click="update = false, income = {amount:null, date:null, category:null}" id="inputName4" placeholder="john doe">+</button>
                            </div>
                            <p :class="msgColor" class="text-capitalize my-auto  d-block" style="font-size:13px">{{msg}}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="table-responsive mt-3 cardBg px-2"  style="max-height:70vh">
                        <table class="table-hover w-100" style="font-size:14px">
                        <thead class="sticky-top top-0">
                            <tr>
                                <th scope="col" style="width: 20px;"> 
                                    <input class="form-check-input"  type="checkbox" v-model="selectAll" @change="selectAllItems" id="flexCheckDefault">
                                </th>
                                <th scope="col">#</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Category</th>
                                <th scope="col">Date</th>
                                <th scope="col">Created At</th>
                                <th scope="col" >
                                    <button v-if="incomes.filter(income => income.merged === false).length > 0"  @click="merge()" class="btn btn-sm rounded-pill p-0 btn-outline-danger"><i class="bi bi-arrow-repeat"></i></button>
                                    <span v-else ><i class="bi bi-arrow-repeat text-success"></i></span>
                                </th>
                                <th scope="col" class="">   
                                    <button class="btn btn-outline-danger btn-sm" v-if="selectAll || selectedItems.length > 0" @click="deleteSelectedItems" ><i class="bi bi-trash3"></i></button>
                                    <i class="bi bi-three-dots" v-else></i>                                 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(income, i) in incomes" :key="i" >
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="selectedItems" :value="income.id"  id="flexCheckDefault">
                                    </div>
                                </td>
                                <td>{{i+1}}</td>
                                <td>{{formattedFloat(income.amount)}}</td>
                                <td>{{income.category}}</td>
                                <td>{{new Date(income.date).toDateString()}}</td>
                                <td>{{new Date(income.createdAt).toLocaleString("en-GB")}}</td>
                                <td>
                                    <i v-if="income.merged" class="bi bi-check-circle-fill text-success"></i>
                                    <i v-else class="bi bi-x-circle-fill text-danger" ></i>
                                </td>                                 
                                <td class="">
                                    <button class="btn-outline-warning btn btn-sm m-1" @click="assignIncome(income), update = true"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-outline-danger btn-sm m-1" @click="deleteItem(income.id)" ><i class="bi bi-trash3"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>        
                </div>
            </div>
            
            <div class="col cardBg">
                <LeftPane>
                    <i class="bi bi-star-half mx-2" ></i>Income Total is GH₵ {{ formattedFloat(total)}}<i class="bi bi-star-half mx-2"></i>
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
            incomes:[],
            selectedItems: [],
            selectAll: false,
            msgColor:null,
            msg:'',
            income:{
                amount:0,
                date:null,
                category:null
            },
            category:[
                'Offering', 'Tithe', 'Seed', 'Thanksgiving', 'Other'
            ],
            savings:[
                {
                    amount:1800,
                    date:'21-07-2023'
                },
                {
                    amount:900,
                    date:'21-07-2023'
                },
                {
                    amount:470,
                    date:'21-07-2023'
                },
                {
                    amount:80,
                    date:'21-07-2023'
                },
                {
                    amount:50,
                    date:'21-07-2023'
                },
                {
                    amount:100,
                    date:'21-07-2023'
                },
                {
                    amount:120,
                    date:'21-07-2023'
                }
            ],
            token:null
        }
    },
    mounted(){
        this.token = this.getCookie('token')
        if(this.token) this.getIncomes()
    },
    methods:{
        selectAllItems() {
            if (this.selectAll) {
                this.selectedItems = this.incomes.map(income => income.id);
            } else {
                this.selectedItems = [];
            }
        },
        getType(index){
            return this.typeofDept[index]
        },
        assignIncome(data){
            this.income = data
        },
        merge(){
            axios.get('http://admin.greatergraceag.com/api/incomes/merge/',
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getIncomes()
            })
            .catch(error =>{
                console.log(error)
            })
        },
        updateIncome(){
            axios.post('http://admin.greatergraceag.com/api/incomes/update/' + this.income.id,  this.income,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getIncomes()
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
        createIncome(e){
            e.preventDefault();
            
            axios.post('http://admin.greatergraceag.com/api/incomes/', this.income,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getIncomes()
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
        getIncomes(){
            axios.get('http://admin.greatergraceag.com/api/incomes/',
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.incomes =  response.data
            })
            .catch(error =>{
                console.log(error)
            })
        },
        deleteSelectedItems() {
            const deletePromises = this.selectedItems.map(id =>
                axios.delete(`http://admin.greatergraceag.com/api/incomes/delete/${id}`,
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
            axios.get('http://admin.greatergraceag.com/api/incomes/delete/'+ id,
             { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.getIncomes()
            })
            .catch(error =>{
                console.log(error)
            })
        }, 
        formattedFloat(incomingValue) {
            const value = parseFloat(incomingValue);

            if (!isNaN(value)) {
                return value.toFixed(2);
            } else {
                return 'Invalid Amount';
            }
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
    computed:{

        total(){
            return  this.incomes.reduce((sum, income) => sum + income.amount, 0);
        }
    },
    watch:{
        navData(newData, oldData){
        if(newData || newData != null){
            this.incomes = newData
        }else{
            this.getIncomes()
        }
        }
    },
}
</script>
<style >
</style>