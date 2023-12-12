<template >
    <div class="m-2" v-if="transactions">
        <h2>Account Summary</h2>
        <hr>
        <p class="text-start">
        This account summary serves as a valuable tool for you, delivering a comprehensive snapshot of your financial status. Inclusive details like account balance and total Expenditure, it ensures you gain a swift overview of your financial activity and a clear understanding of your position. </p>
        <li class="list-group-item p-0 mt-0 fst-italic d-flex justify-content-between align-items-center">
            <h6 class="fw-bold">Your Breakdown</h6>
            
            <span style="font-size:13px" class="text-dark">Starting: {{new Date(transactions[0][0].createdAt).toDateString()}}</span>
        </li>
        <ul class="list-group my-4" style="font-size:13px">                                    
            <li class="list-group-item p-0 mt-3 fw-bolder d-flex justify-content-between align-items-center">
                Total Expenditure
            <span class="text-dark">{{transactions[2].sumDebits}}</span>
            </li>
            
            <span class="border border-3 border-danger shadow rounded-1 my-2 p-1" style="border-color:#ff0e0e5e!important">
                <li class="list-group-item fw-bolder p-0   d-flex justify-content-between align-items-center" >
                Outstanding Debt
                <span class="text-dark" v-if="debts">{{debts[1].toFixed(2)}}</span>
                </li>
                <li class="list-group-item p-0 mt-0 fst-italic d-flex justify-content-between align-items-center">
                Closest Due Date
                <span v-if="closestDate" class="text-dark">{{ new Date(closestDate.due).toDateString() }}</span>
                </li>
            </span>
            
            <li class="list-group-item p-0 my-4 d-flex fw-bolder justify-content-between align-items-center"  >
                Account Balance
                <span class="badge bg-warning  text-dark rounded-pill">Ghs {{transactions[2].lastEntryBalance.toFixed(2)}}</span>
            </li>
            <li class="list-group-item p-0  d-flex  justify-content-center align-items-center"  >
               <span class="badge bg-outline-info py-2 px-4 text-dark rounded-pill"><slot></slot></span>
            </li>
            <!-- <li class="list-group-item p-0 mt-3  d-flex justify-content-between align-items-center">
            Amount Paid
            <span class="text-dark">GH₵ {{ticket[0].paid}} </span>
            </li>
            <li class="list-group-item p-0 mt-0  d-flex justify-content-between align-items-center">
            Unpaid Bal.
            <span class="text-dark">GH₵ {{ticket[0].balance}} </span>
            </li> -->
        </ul>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    data() {
        return {
            debts:null,
            transactions:null,
            closestDate:null,
            ledgerhead:{},
            token:null
        }
    },
    created(){
        this.token = this.getCookie('token')
        if(this.token) {
            this.getTransactions()
            this.getDebts()
        }

    },
    methods:{
        getTransactions(){
            axios.get('http://ggc.pangtresses.com/api/ledgers/ledgers/'+ 0,
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then((res)=>{
                this.transactions = res.data
            }).catch((err)=>{
                console.log(err)
            })
        },
        getDebts(){
            axios.get('http://ggc.pangtresses.com/api/debts/',
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.debts =  response.data
                this.closestDate = this.findClosestDate(this.debts[0])
            })
            .catch(error =>{
                console.log(error)
            })
        },
        findClosestDate(array) {
            const today = new Date();
            array.sort((a, b) => Math.abs(a.due - today) - Math.abs(b.due - today));
            return array[0];
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
}
</script>
<style scoped>
    .list-group-item{
        border: none;
    }
</style>