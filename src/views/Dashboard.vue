<template>
      <div class="row row-cols-1 row-cols-md-3 row-cols-md-3 pt-2 g-4">
        <div class="col" v-for="(cardx , i) in uppercards" :key="i">
          <Card   :card="cardx"/>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-8 mb-3 mb-sm-0">
          <div class="card bg-transparent">
            <div class="card-body">
              <div class="d-flex card-title">
                <div class="p-2 flex-grow-1 fw-bold">Your Monthly Expense</div>
                <div class="p-2 " style="font-size:12px">
                  <select class="form-select form-select-sm" v-model="chart_cat" aria-label="Small select example">
                    <option selected disabled >Select View</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Debt">Debts</option>
                    <option value="Income">Income</option>
                    <option value="Tithe">Tithes</option>
                  </select>
                </div>
              </div>
              <div style="height:200px">
                <Bar v-if="reports" :monthlyData="monthlyDataToBar"/>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card bg-transparent">
            <div class="card-body">
              <div class="d-flex card-title">
                <div class="p-2 flex-grow-1 fw-bold">Most Expenses </div>
                <div class="p-2 " style="font-size:12px">
                  <select class="form-select form-select-sm" v-model="pie_cat" aria-label="Small select example">
                    <option selected disabled >Select View</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Debt">Debts</option>
                    <option value="Income">Income</option>
                  </select>                
                </div>
              </div>
              <div>
                <Pie v-if="reports" :categoryData="categoryDataToPie" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-body">
          <div class="d-flex card-title">
            <div class="p-2 flex-grow-1 fw-bold">Current Ledger</div>
            <div class="p-2 " style="font-size:12px">Data Updates Every 3 Hrs
              <button class=" btn btn-secondary btn-sm"  style="font-size:12px"> View All Orders</button>
            </div>
          </div>
            <div v-if="records.length > 0">
              <div class="table-responsive my-3">
                  <table class="table table-hover " style="font-size:14px">
                  <thead>
                      <tr>
                          <th scope="col">#</th>
                          <th scope="col">Attendance</th>
                          <th scope="col">VIPs</th>
                          <th scope="col">Offering</th>
                          <th scope="col">Tithe</th>
                          <th scope="col">Seed</th>
                          <th scope="col">Welfare</th>
                          <th scope="col">ThanksGiving</th>
                          <th scope="col">Date</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(record, i) in records.slice(0, 5)" :key="i">
                          <td>{{i +1}}</td>
                          <td>{{record.attendance}}</td>
                          <td>{{record.vips}}</td>
                          <td>{{record.offering}}</td>
                          <td>{{record.tithe}}</td> 
                          <td>{{record.seed}}</td>
                          <td>{{record.welfare}}</td>
                          <td>{{record.thanksgiving}}</td>
                          <td>{{new Date(record.date).toDateString()}}</td>  
                      </tr>
                  </tbody>
                  </table>
              </div>        
            </div>
        </div>
      </div>
</template>
<script>


import Card from '../components/card.vue'
import Bar from '../components/barchart.vue'
import Pie from '../components/pie.vue'
import axios from 'axios'

export default {
    props: {
      navData:Object
    },
  components: { 
    Bar,
    Card,
    Pie,
  },
    data() {
        return {
            token:null,
            chart_cat:'Expenses',
            pie_cat:'Expenses',
            reports:null,
            records:[],
            uppercards:[
              {
                title:'Total Savings',
                amount:'GHS 20.4',
                percentage:95,
                comment:'Savings counted',
                color:'#ffc412'
              },
              {
                title:'Total Owed',
                amount:'GHS 820.21',
                percentage:80,
                comment:'02-08 Closest due Date',
                color:'#02802e'
              },
              {
                title:'Overall Expenses',
                amount:'GHS 18.2K',
                percentage:85,
                comment:'Available to payout',
                color:'#a00404'
              }
            ]
        }
    },
    created(){
      this.token =  this.getCookie('token')
      if(this.token) {
        this.getReports()
        this.getRecords()
      }
    },
    methods: {
          getRecords(){
            axios.get('http://ggc.pangtresses.com/api/records/', 
            { headers:{'Authorization': `Bearer ${this.token}`}})
            .then(response => {
                this.records =  response.data
            })
            .catch(error =>{
                console.log(error)
            })
        },
        getReports(){
          axios.post('http://ggc.pangtresses.com/api/dashboards/search','',
            { headers:{'Authorization': `Bearer ${this.token}`}})
          .then(response => {
            this.uppercards[0].amount = response.data.lastEntry.balance.toFixed(2)
            var amount = response.data.totalDebtBalance[0].totalDebtBalance
            this.uppercards[1].amount = amount == '' || amount == null ? 0 : amount.toFixed(2)
            this.uppercards[1].percentage = (response.data.totalDebtBalance[0].totalDebtBalance/(response.data.totalDebtBalance[0].totalDebtBalance + response.data.totalPaid[0].totalPaid)) * 100
            this.uppercards[2].amount = response.data.totalExpensesSum.toFixed(2)

            this.reports = response.data
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
    computed:{
        monthlyDataToBar(){
            const newArray = Array.from({ length: 12 }, () => 0);
              this.reports[`monthly${this.chart_cat}Sum`].forEach(({ total, month }) => {
                newArray[month - 1] = total;
              });
             return newArray
        },
        categoryDataToPie(){
          const totalsArray = this.reports[`category${this.pie_cat}Sum`].map(item => item.total);
          const categoriesArray = this.reports[`category${this.pie_cat}Sum`].map(item => item.category);

          return [totalsArray, categoriesArray]
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
<style scoped>
    .btn-secondary{
      background-color:  #e4e4e4;
      border:none;
      color: #000;
      }
    .bi{
      padding-inline: 1px;
    }
    body{
        min-height: 100vh;
        min-height: -webkit-fill-available;
        background-color: rgb(230, 230, 230) !important;
    }
    .dropdown-item{
        font-size: 12px;
    }
    .btn-light:focus{
    color: #000;
    background-color: #fbf9f9;
    border-color: #f9fafb;
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 0%) !important;
    }

</style>