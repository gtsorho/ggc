const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const {Op, Sequelize, where } = require("sequelize")
require('dotenv').config()
const path = require('path');


module.exports = {


    getLedger: async(req, res)=>{
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true},
        })  
        ledgersCount = await db.ledger.count({where:{ledgerHeadId:activeLedger_head.id}})

        let ledgersPage = await db.ledger.findAll({
            offset: parseInt(req.params.i), limit: 15 ,
            where:{ledgerHeadId:activeLedger_head.id}
        })

        let lastEntry = await db.ledger.findOne({
            where:{ledgerHeadId:activeLedger_head.id},
            order: [['id', 'DESC']],
        });

        let result = {
            sumCredits : await db.ledger.sum('credit',
            { where:{ledgerHeadId:activeLedger_head.id}}
            ),
            sumDebits : await db.ledger.sum('debit',
               { where:{ledgerHeadId:activeLedger_head.id}}
            ),
            lastEntryBalance : lastEntry.balance
        }

        res.send([ledgersPage, ledgersCount, result]) 
    },

    getActive: async(req, res)=>{
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active: true}
        })   
        res.send(activeLedger_head)
    },

    getLedgerHead: async(req, res)=>{
        let ledger_heads = await db.ledger_head.findAll({})
        res.send(ledger_heads)
    },

    createLedger: async (req, res) => {

        function validExtOfficer(ledger){
            const schema = Joi.object({
                category:Joi.string().required(),
                description:Joi.string().required(),
                receivable_src:Joi.string().allow(null),
                payable_dest: Joi.string().allow(null),
                account_no:Joi.string().required(),
                credit:Joi.number(),
                debit: Joi.number(),
            })
            return schema.validate(ledger)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })

        let latestLedger = await db.ledger.findOne({
            where: {
                ledgerHeadId:activeLedger_head.id
            },
            order: [ [ 'createdAt', 'DESC' ]],
        })

        const countLedger = await db.ledger.count({
            where:{ledgerHeadId : activeLedger_head.id}
        })

        let availableBalance
        let currentBalance

        if(countLedger < 1){
            availableBalance = activeLedger_head.start_bal
            currentBalance = availableBalance + parseFloat(req.body.credit) - parseFloat(req.body.debit)
        }else{
            availableBalance = latestLedger.balance
            currentBalance = availableBalance +parseFloat(req.body.credit) - parseFloat(req.body.debit)
        }

        if(currentBalance < 0){
            res.send('insufficient Balance, try crediting account first \n or reduce amounts', 422)
        }

         ledger = {
            'ledgerHeadId':activeLedger_head.id,
            'category': req.body.category,
            'description': req.body.description,
            'receivable_src': req.body.receivable_src,
            'payable_dest': req.body.payable_dest,
            'account_no': req.body.account_no,
            'credit': req.body.credit,
            'debit': req.body.debit,
            'balance': currentBalance
        }


        ledger = await db.ledger.create(ledger)
        res.send(ledger) 

    }, 

    setActiveHead: async (req, res)=>{
        await db.ledger_head.update({ active: false },{ where: {}});

        await db.ledger_head.update({ active: true }, {
            where: {
              id: req.params.index
            }
        });
    },

    createLedger_head: async (req, res) => {

        function validExtOfficer(ledger_head){
            const schema = Joi.object({
                account_name:Joi.string().required(),
                account_no:Joi.string().required(),
                title:Joi.string().required(),
                start_bal: Joi.number().required(),
            })
            return schema.validate(ledger_head)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

        let head = await db.ledger_head.findOne({where:{title:req.body.title}})
        if(head) return res.status(400).send('ledgerHead already exists')


        await db.ledger_head.update({ active: false },
            {
                where: {
                    active: true
                }
            });

        ledger_head = {
            'account_name': req.body.account_name,
            'account_no': req.body.account_no,
            'title': req.body.title,
            'start_bal': req.body.start_bal,
            'active': true,
        }

        ledger_head = await db.ledger_head.create(ledger_head)

        data = {
            'category': 'initial',
            'description': 'empty record',
            'receivable_src': 'none',
            'payable_dest': 'none',
            'account_no': 'none',
            'credit': 0,
            'debit': 0,
        }

        try {
            let result = await module.exports.createLedgerInt(data);
            res.send([ledger_head, result])
        } catch (error) {
            console.log(error)
        }
    }, 
    updateLedgerHead: async (req, res) => {
        function validExtOfficer(ledger_head){
            const schema = Joi.object({
                account_name:Joi.string().allow(null),
                account_no:Joi.string().allow(null),
                title:Joi.string().allow(null),
                start_bal: Joi.number().allow(null),
                active: Joi.number().allow(null),
            }).unknown(true)
            return schema.validate(ledger_head)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

        let head = await db.ledger_head.findOne({where:{title:req.body.title}})
        if(head) return res.status(400).send('ledgerHead already exists')

        ledger_head = await db.ledger_head.update(req.body, {
            where:{id : req.params.id}
        })

        res.send(ledger_head)
    }, 

    update: async (req, res) => {
        function validExtOfficer(debt){
            const schema = Joi.object({
                category:Joi.string().allow(null),
                description:Joi.string().allow(null),
                receivable_src:Joi.string().allow(null),
                payable_dest: Joi.string().allow(null),
                account_no:Joi.string().allow(null),
                credit:Joi.number().allow(null),
                debit: Joi.number().allow(null),
            }).unknown(true)
            return schema.validate(debt)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)
        
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })

         ledger = {
            'ledgerHeadId':activeLedger_head.id,
            'category': req.body.category,
            'description': req.body.description,
            'receivable_src': req.body.receivable_src,
            'payable_dest': req.body.payable_dest,
            'account_no': req.body.account_no,
            'credit': req.body.credit,
            'debit': req.body.debit,
            'balance': req.body.balance,
        }

        ledger = await db.ledger.update(ledger, {
            where:{id : req.params.id}
        })
        await module.exports.updateBalance();
        res.send(ledger)
    }, 

    delete: async(req, res) =>{
       let ledger = await db.ledger.destroy({
            where: {
              id: req.params.id 
            }
          });
          await module.exports.updateBalance();
        res.sendStatus(200)
    },
    deleteLedgerHead: async(req, res) =>{
        let ledger = await db.ledger_head.destroy({
             where: {
               id: req.params.id 
             }
           });
         res.sendStatus(200)
     },
    updateBalance: async() => {
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active: true}
        })  

        const transactions = await db.ledger.findAll({
          where: {
            ledgerHeadId: activeLedger_head.id
          },
        });
      
        let currentBalance = activeLedger_head.start_bal;
      
        for (const transaction of transactions) {
          currentBalance = currentBalance + transaction.credit - transaction.debit;
            
          await transaction.update({
            balance: currentBalance
          });
        }
    },
// *******************************************************************************************
// ********************************************************************************
// ***********************************************************************
    createLedgerInt : async (transaction) => {

        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })

        let latestLedger = await db.ledger.findOne({
            where: {
                ledgerHeadId:activeLedger_head.id
            },
            order: [ [ 'createdAt', 'DESC' ]],
        })

        const countLedger = await db.ledger.count({
            where:{ledgerHeadId : activeLedger_head.id}
        })

        let availableBalance
        let currentBalance
        
        if(countLedger < 1){
            availableBalance = activeLedger_head.start_bal
            currentBalance = availableBalance + parseFloat(transaction.credit) - parseFloat(transaction.debit)
        }else{
            availableBalance = latestLedger.balance
            currentBalance = availableBalance + parseFloat(transaction.credit) - parseFloat(transaction.debit)
        }

        if(currentBalance < 0){
            return Promise.reject(new Error('insufficient Balance, try crediting account first \n or reduce amounts' ))
        }


        ledger = {
            'ledgerHeadId':activeLedger_head.id,
            'category': transaction.category,
            'description': transaction.description,
            'receivable_src': transaction.receivable_src,
            'payable_dest': transaction.payable_dest,
            'account_no': transaction.account_no,
            'credit': transaction.credit,
            'debit': transaction.debit,
            'balance': currentBalance,
            'table_ref':transaction.hasOwnProperty('table_ref') ? transaction.table_ref : null
        }

        ledger = await db.ledger.create(ledger)
        return ledger
    },
     // ***********************************************SEARCH
     search: async (req, res) => {
        const {searchValue, startDate, endDate} = req.body

        const whereClause = {};
        
        if (searchValue) {
              whereClause[Op.or] = [
                { description: { [Op.like]: `%${searchValue}%` } },
                { category: { [Op.like]: `%${searchValue}%` } },
                { receivable_src: { [Op.like]: `%${searchValue}%` } },
                { payable_dest: { [Op.like]: `%${searchValue}%` } },
                { account_no: { [Op.like]: `%${searchValue}%` } },
                // Add more columns as needed
              ]
          }

        if (startDate && endDate) {
            whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        }
    
        const searchResults = await db.ledger.findAll({
            where: whereClause,
        });
     
        res.send(searchResults)
    }
}