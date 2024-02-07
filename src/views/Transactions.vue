<template >
<div>
        <Loader v-if="loading"/>
    <div v-else >
        <Ledger class="shadow" @update="handleUpdate" />
<button class="btn btn-sm rounded-0 btn-outline-primary rounded-pill px-3" ref="sideCanvas" hidden type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><i class="bi bi-plus-lg"></i> Transaction</button>
        <div class="offcanvas border-0 shadow-lg offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h6 class="offcanvas-title" id="offcanvasRightLabel">{{update ? 'Update' : 'New'}} Transaction</h6>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body px-4">
                <div class="form-check form-switch mb-5">
                    <input class="form-check-input" type="checkbox" v-model="transactionType" role="switch" id="flexSwitchCheckChecked" >
                    <label class="form-check-label" for="flexSwitchCheckChecked">Record <span class="px-2 py-1 fw-light rounded-pill text-light" :class="transactionType ? 'bg-warning' : 'bg-success' " >Transaction {{transactionType ? 'from' : 'into' }}</span> Account</label>
                </div>
                <div class="row row-cols-1 row-cols-sm-1 row-cols-md-1  d-flex justify-content-center align-items-center">
                    <div class="col my-3">
                        <label class="form-label" for="autoSizingInput">Description</label>
                        <textarea  class="form-control  form-control-sm rounded-2 border-0" cols="6" v-model="transaction.description"  id="autoSizingInput" placeholder="JoLorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis mi"></textarea>
                    </div>
                    <div class="col my-3" v-if="transactionType">
                        <label class="form-label" for="autoSizingInputGroup">Debit Amount</label>
                        <input type="text"  v-model.number="transaction.debit" class="form-control  form-control-sm rounded-pill border-0" id="autoSizingInputGroup" placeholder="eg 0.00">
                    </div>
                    <div class="col my-3" v-if="!transactionType">
                        <label class="form-label" for="autoSizingInputGroup">Credit Amount</label>
                        <input type="text" v-if="!transactionType" v-model.number="transaction.credit" class="form-control  form-control-sm  border-0" id="autoSizingInputGroup" placeholder="eg 0.00">
                    </div>
                     <div class="col my-3">
                       <label for="inputAddress2" class="form-label">Category</label>
                            <input type="text" v-if="!transactionType" disabled value="Other Income" class="form-control form-control-sm rounded-pill " id="inputAddress2" placeholder="Bill">
                            <select v-else v-model="transaction.category" class="form-select form-control   form-select-sm" aria-label="Small select example">
                                <option v-for="(category, i) in categories" :key="i" :value="category">{{category}}</option>
                            </select>
                    </div>
                    <div class="col my-3">
                        <label for="inputAddress2" class="form-label">{{transactionType ? 'Payable Destination' : 'Receivable Src'}}</label>
                        <input type="text" v-if="transactionType"  v-model="transaction.payable_dest"  class="form-control form-control-sm " id="inputAddress2" placeholder="john doe">
                        <input type="text" v-else v-model="transaction.receivable_src" class="form-control form-control-sm " id="inputAddress2" placeholder="john doe">
                    </div>
                    <div class="col my-3">
                        <label for="inputAddress2" class="form-label">Contact/Acc No#</label>
                        <input type="text" v-if="!transactionType" value="general deposit"   class="form-control form-control-sm " disabled id="inputAddress2" placeholder="eg. 029 xxx xxxx">
                        <input type="text" v-else v-model="transaction.account_no" class="form-control form-control-sm " id="inputAddress2" placeholder="eg. 029 xxx xxxx">
                    </div>
                    
                </div>  
                <div class=" d-flex justify-content-between">
                        <div>
                            <button v-if="!update" :class="transactionType ? 'bg-warning' : 'bg-success'" @click="addTransaction"  class="btn  text-light btn-sm rounded-pill px-5 mt-4">{{transactionType ? 'Debit' : 'Credit'}}</button>
                            <button v-else  @click="updateLedger"  class="btn bg-warning text-light btn-sm rounded-pill px-5 mt-4">Update</button>  
                        </div>
                        <p :class="msgColor" class="text-capitalize my-auto  d-block" style="font-size:13px">{{msg}}</p>
                </div>               
            </div>
        </div>
    </div>
</div>
</template>
<script>
import axios from 'axios'
import Ledger from "../components/ledger.vue"
import Loader from "../components/loader.vue"


export default {
    props: {
        navData:Object
    },
    components:{
        Ledger,
        Loader
    },
  props: {
    navData:Object
  },
    data() {
        return {
            loading: false,
            update:false,
            msgColor:null,
            msg:'',
            transaction:{
                category:null,
                description:'',
                account_no:null,
                receivable_src:'',
                payable_dest:'',
                credit:0,
                debit:0
            },
            ledgerhead:{},
            transactions:[],
            transactionType:true,
            categories:['general', 'honorarium', 'tnt', 'bill', 'seed', 'offering', 'tithe'],
            token:null
        }
    },
    mounted(){
        
        this.token = this.getCookie('token')
        if(this.token) this.getTransactions(0)
    },
    methods: {
        handleUpdate(transactionItem){
            this.transaction = transactionItem
            if(this.transaction.debit > 0){
                this.transactionType = true
            }else{
                this.transactionType = false
            }
            this.update = true
        },
        updateLedger(){
            axios.post('http://admin.greatergraceag.com/api/ledgers/update/'+this.transaction.id, this.transaction,
          { headers:{'Authorization': `Bearer ${this.token}`}}
            ).then((res)=>{
                this.getTransactions(0)
            }).catch((err)=>{
                this.msg = err.response.data
				this.msgColor = 'text-danger'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
                // console.log(err)
            })
        },
        getTransactions(i){
            
            this.loading = true
            axios.get('http://admin.greatergraceag.com/api/ledgers/ledgers/'+ i,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then((res)=>{
                this.transactions = res.data
                this.loading = false;
            }).catch((err)=>{
                console.log(err)
            }).finally(() => {
                this.axiosRequestInProgress = false;
            });

            axios.get('http://admin.greatergraceag.com/api/ledgers/active',
            { headers:{'Authorization': `Bearer ${this.token}`}}
            ).then((res)=>{
                this.ledgerhead = res.data
            }).catch((err)=>{
                console.log(err)
            })
        },
        addTransaction(){
            if(this.transactionType){
                this.transaction.credit = 0.00
            }else{
                this.transaction.debit = 0.00
            }

            let data = {
                description: this.transaction.description,
                receivable_src: this.transaction.receivable_src ? this.transaction.receivable_src : null,
                payable_dest: this.transaction.payable_dest ? this.transaction.payable_dest : null,
                category: this.transactionType ? this.transaction.category : 'Other',
                account_no: this.transactionType ? this.transaction.account_no : 'general deposit',
                credit: parseFloat(this.transaction.credit).toFixed(2),
                debit: parseFloat(this.transaction.debit).toFixed(2)
            }

            axios.post('http://admin.greatergraceag.com/api/ledgers', data,
            { headers:{'Authorization': `Bearer ${this.token}`}}
            ).then((res)=>{
                this.getTransactions(0)
            }).catch((err)=>{
                this.msg = err.response.data
				this.msgColor = 'text-danger'
				setInterval(() => {
					this.msg = ''
					this.msgColor = null
				}, 5000);
                // console.log(err)
            })
        },
        searchVendor(){
            let str = this.vendor.name
            
            if(str || str !== "" ){
                axios.get(`http://admin.greatergraceag.com/api/vendor/search/${str}`,
                { headers:{'Authorization': `Bearer ${this.token}`}}
                ).then((res)=>{
                    this.vendors = res.data
                }).catch((err)=>{
                    console.log(err)
                })
            }else{
                this.getVendors()
            }   
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
    },
    watch:{
      navData(newData, oldData){
        if(newData || newData != null){
          this.transactions = newData
        }else{
          this.getTransactions()
        }
      }
    },
}
</script>
<style scoped>
    .search-field, .form-control {
    border: none;
    border-radius: 100px;
    outline: none;
    } 

    .search-button {
    background: transparent;
    border: none;
    outline: none;
    margin-left: -33px;
    }

    .form-control{
        background-color: transparent !important;
        border-bottom: 2px solid #008080 !important;
        border-radius: 0 !important;
    }
    .form-control:focus{
        border-bottom: 2px solid #02acac80 !important;
    }
    label{
        font-size: 13px;
        font-weight: bold;
    }
</style>