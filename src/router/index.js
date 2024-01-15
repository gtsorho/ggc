import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Main from '@/views/Main.vue'
import Income from '@/views/Income.vue'
import Debt from '@/views/Dept.vue'
import Expense from '@/views/Expense.vue'
import Dashboard from '@/views/Dashboard.vue'
import Tithe from '@/views/Tithe.vue'
import Members from '@/views/Members.vue'
import Ledger from '@/views/Transactions.vue'
import Records from '@/views/Record.vue'
import Settings from '@/views/Settings.vue'
import Events from '@/views/Event.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: HomeView
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children:[
        {
          path: 'incomes',
          name: 'incomes',
          component: Income
        },
        {
          path: 'ledgers',
          name: 'ledgers',
          component: Ledger
        },
        {
          path: 'debts',
          name: 'debts',
          component: Debt
        },
        {
          path: 'expenses',
          name: 'expenses',
          component: Expense
        },{
          path: 'dashboards',
          name: 'dashboards',
          component: Dashboard
        },
        {
          path: 'tithes',
          name: 'tithes',
          component: Tithe
        },
        {
          path: 'members',
          name: 'members',
          component: Members
        },
        {
          path: 'records',
          name: 'records',
          component: Records
        },
        {
          path: 'events',
          name: 'events',
          component: Events
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings
        }
      ]
    }
  ]
})

export default router
