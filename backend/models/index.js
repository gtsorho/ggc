const {Sequelize, DataTypes}  = require("sequelize");
const member = require('./member')
const tithe = require('./tithe')
const income = require('./income')
const expense = require('./expense')
const debt = require('./debt')
const ledger_head = require('./ledger_head')
const ledger = require('./ledger')
const record = require('./record')
const user = require('./user')
const setting = require('./setting')
const event = require('./event')




require('dotenv').config()

const sequelize = new Sequelize(
   'ch_db',
   'clq2aij630fn69sqh642nbirv',
   'd5R6SnN5qBXkzbI9RMlqBGrg',
   {
      host: 'clq2aij65000gqh9s9b32denl',
      dialect: 'mysql',
      logging: false
   }
);

// const sequelize = new Sequelize(
//    'ch_db',
//    'clq2aij630fn69sqh642nbirv',
//    'd5R6SnN5qBXkzbI9RMlqBGrg',
//    {
//       host: '5.182.33.208',
//       port: 9002,
//       dialect: 'mysql',
//       logging: false
//    }
// );


const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

db.member = member(sequelize, DataTypes)
db.tithe = tithe(sequelize, DataTypes)
db.income = income(sequelize, DataTypes)
db.expense = expense(sequelize, DataTypes)
db.debt = debt(sequelize, DataTypes)
db.ledger_head = ledger_head(sequelize, DataTypes)
db.ledger = ledger(sequelize, DataTypes)
db.record = record(sequelize, DataTypes)
db.user = user(sequelize, DataTypes)
db.setting = setting(sequelize, DataTypes)
db.event = event(sequelize, DataTypes)




db.member.hasMany(db.tithe);
db.tithe.belongsTo(db.member);

db.ledger_head.hasMany(db.ledger)
db.ledger.belongsTo(db.ledger_head)

db.ledger_head.hasMany(db.tithe)
db.ledger_head.hasMany(db.income)
db.ledger_head.hasMany(db.expense)
db.ledger_head.hasMany(db.debt)
db.ledger_head.hasMany(db.record)


db.tithe.belongsTo(db.ledger_head)
db.income.belongsTo(db.ledger_head)
db.expense.belongsTo(db.ledger_head)
db.debt.belongsTo(db.ledger_head)
db.record.belongsTo(db.ledger_head)


sequelize.sync({ alter: true,  force: false })
.then(()=>{
    console.log('all ch_db in sync')
})


sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully to ch_db.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

module.exports = db