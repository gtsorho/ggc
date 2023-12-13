const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const tithes = require('./backend/routes/tithes')
const income = require('./backend/routes/income')
const debts = require('./backend/routes/debts')
const expenses = require('./backend/routes/expenses')
const member = require('./backend/routes/member')
const ledger = require('./backend/routes/ledger')
const records = require('./backend/routes/records')
const users = require('./backend/routes/users')
const dashboard = require('./backend/routes/dashboard')
const settings = require('./backend/routes/setting')







const cors = require('cors');

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cors({
    origin: '*'
}));

app.use('/api/tithes', tithes)
app.use('/api/incomes', income)
app.use('/api/debts', debts)
app.use('/api/expenses', expenses)
app.use('/api/members', member)
app.use('/api/ledgers', ledger)
app.use('/api/records', records)
app.use('/api/users', users)
app.use('/api/dashboards', dashboard)
app.use('/api/settings', settings)


app.use('/', serveStatic(path.join(__dirname,'/dist')))

app.get(/.*/, function(req, res){
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

  

const port = process.env.PORT || 3000
app.listen(port)
console.log('listening on port:' + port)
