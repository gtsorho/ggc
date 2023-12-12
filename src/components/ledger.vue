<template>
  <div class="table-responsive" style="max-height: 6.5in" v-if="ledger.length > 0">
    <table class="table table-hover table-striped" style="font-size: 14px">
      <thead>
        <tr class="table-info">
          <td colspan="4">
            <p class="p-0 m-0">Title: {{ ledgerhead.title }}</p>
            <p class="p-0 m-0">Account No: {{ ledgerhead.account_no }}</p>
            <p class="p-0 m-0">Account Name: {{ ledgerhead.account_name }}</p>
          </td>
          <td class="fw-bolder text-end" colspan="5">
            <p class="p-0 m-0">
              Starting Bal: GHC
              {{ parseFloat(ledgerhead.start_bal).toFixed(2) }}
            </p>
            <p class="p-0 m-0">
              Closing Bal: GHC
              {{ ledgerSums.lastEntryBalance.toFixed(2) }}
            </p>
          </td>
        </tr>
      </thead>
      <hr class="my-1" />

      <thead class="" style="position: sticky; top: 0">
        <tr>
          <td colspan="2">
            <button
              class="btn btn-sm rounded-0 btn-outline-primary rounded-pill px-3" type="button" ref="sideCanvas" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" >
              <i class="bi bi-plus-lg"></i> Transaction
            </button>
          </td>
          <td colspan="4" style="background-color: #fff"></td>
          <td class="bg-warning text-center text-light" colspan="2">
            Transaction
          </td>
          <td class="bg-success text-center text-light" colspan="1">Balance</td>
        </tr>
        <tr style="background-color: #29345a; color: #eaeaeae3">
          <th scope="col">Date</th>
          <th scope="col">Description</th>
          <th scope="col">Category</th>
          <th scope="col">Ref</th>
          <th scope="col">Acc/Contact</th>
          <th scope="col">payable_dest/receivable_src</th>
          <th scope="col">Credit</th>
          <th scope="col">Debit</th>
          <th scope="col">Bal</th>
        </tr>
      </thead>
      <tbody>
        {{}}
        <tr v-for="(transaction, i) in ledger" :key="i" @contextmenu.prevent="showContextMenu($event) , transactionItem = transaction">
          <td>{{ transaction.createdAt.split("Z")[0] }}</td>
          <td class="w-25">{{ transaction.description }}</td>
          <td class="text-truncate">{{ transaction.category }}</td>
          <td>GGC00{{ transaction.id }}</td>
          <td>
            {{
              transaction.payable_dest == null &&
              transaction.receivable_src == null
                ? "-"
                : transaction.payable_dest
                ? transaction.payable_dest
                : transaction.receivable_src
            }}
          </td>
          <td>
            {{
              transaction.payable_dest == null &&
              transaction.receivable_src == null
                ? "-"
                : transaction.payable_dest
                ? transaction.payable_dest
                : transaction.receivable_src
            }}
          </td>
          <td class="table-warning">{{ transaction.credit.toFixed(2) }}</td>
          <td class="table-warning">{{ transaction.debit.toFixed(2) }}</td>
          <td class="table-success">{{ transaction.balance.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-show="contextMenuVisible" class="context-menu rounded-1 bg-light list-group" style="font-size:13px; width:150px" :style="{ top: `${contextMenuPosition.y}px`, left: `${contextMenuPosition.x}px` }">
      <div @click="handleContextMenuItem(1)" class=" py-0 border-0 text-muted  list-group-item list-group-item-action"  > <i class="bi bi-caret-right-fill d-none"></i> Update</div>
      <div @click="handleContextMenuItem(2)" class=" py-0  border-0 text-muted  list-group-item list-group-item-action"><i class="bi bi-caret-right-fill d-none"></i> Delete</div>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination pagination-sm  justify-content-center">
        <li class="page-item rounded-pill" :class="{ disabled: pagination.currentPage === 1 }">
          <a class="page-link" @click="prevPage">Previous</a>
        </li>

        <li v-for="page in pagination.totalPages" :key="page" class="page-item bg-transparent rounded-pill" :class="{ active: page === pagination.currentPage }" >
          <a class="page-link bg-transparent border-secondary px-1 mx-1 rounded-1 text-dark" @click="gotoPage(page)">{{ page }}</a>
        </li>

        <li class="page-item rounded-pill" :class="{disabled: pagination.currentPage === pagination.totalPages,}" >
          <a class="page-link" @click="nextPage">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: {},
  emits: ["pagination",'update'],
  data() {
    return {
      ledgerSums:{},
      transactionItem :{},
      contextMenuVisible: false,
      contextMenuPosition: { x: 0, y: 0 },
      pagination: {
        currentPage: 1,
        totalPages: 0,
        limit: 15,
      },
      ledger: [],
      ledgerhead: {},
      token:null
    };
  },
  mounted(){
    this.token = this.getCookie('token')
    if(this.token) this.getTransactions()
  },
  methods: {
    prevPage() {
      if (this.pagination.currentPage > 1) {
        this.pagination.currentPage--;
        this.getTransactions();
      }
    },
    nextPage() {
      if (this.pagination.currentPage < this.pagination.totalPages) {
        this.pagination.currentPage++;
        this.getTransactions();
      }
    },
    gotoPage(page) {
      this.pagination.currentPage = page;
      this.getTransactions();
    },
    getTransactions() {
        axios.get("http://localhost:3000/api/ledgers/ledgers/" + (this.pagination.currentPage - 1) * this.pagination.limit,
        { headers:{'Authorization': `Bearer ${this.token}`}})
        .then((res) => {
            this.ledger = res.data[0];
            this.pagination.totalPages = Math.ceil(res.data[1] / this.pagination.limit);
            this.ledgerSums = res.data[2]
        })
        .catch((err) => {
          console.log(err);
        })

        axios.get("http://localhost:3000/api/ledgers/active",
        { headers:{'Authorization': `Bearer ${this.token}`}})
        .then((res) => {
          this.ledgerhead = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    assignLedger(data){
      this.tithe = data
    },
    showContextMenu(event) {
      event.preventDefault();
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
      this.contextMenuVisible = true;
      
      document.addEventListener('click', this.closeContextMenu);
    },
    handleContextMenuItem(option) {
      if(option == 1){
        this.$refs.sideCanvas.click()
        this.$emit('update', this.transactionItem)
      }else{
        this.deleteItem(this.transactionItem.id)
      }
      this.closeContextMenu();
    },
    closeContextMenu() {
      this.contextMenuVisible = false;
      document.removeEventListener('click', this.closeContextMenu);
    },
    deleteItem(id){
      console.log(id)
      axios.get('http://localhost:3000/api/ledgers/delete/'+ id,
      { headers:{'Authorization': `Bearer ${this.token}`}})
      .then(response => {
          this.getTransactions()
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
};
</script>
<style scoped>
th {
  position: sticky;
  top: 0;
}

.portfolio-img {
  border-radius: 50%;
  object-fit: cover;
}
tbody,
td,
tfoot,
th,
thead,
tr {
  border-style: none;
}
.context-menu {
  position: absolute;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  padding: 5px;
  z-index: 1000;
  cursor: pointer;
}
.list-group-item:hover{
  background-color: #8b8b8b3c;
}

.list-group-item:hover .bi{
  color: #8b8b8b79;
  display: inline !important;
}
</style>