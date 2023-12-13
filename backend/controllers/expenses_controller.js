const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const {Op, Sequelize } = require("sequelize")
require('dotenv').config()
const path = require('path');
const lc = require('./ledger_controller')


module.exports = {


    getExpenses: async(req, res)=>{
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })
        let expenses = await db.expense.findAll({
            where:{ledgerHeadId:activeLedger_head.id}
        })
        res.send(expenses)
    },

    create: async (req, res) => {
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
          })
        
        function validExtOfficer(expense){
            const schema = Joi.object({
                amount:Joi.number().required(),
                description:Joi.string().required(),
                category:Joi.string().required(),
                date: Joi.date().required()
            })
            return schema.validate(expense)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         expense = {
            'ledgerHeadId':activeLedger_head.id,
            'amount': req.body.amount,
            'description': req.body.description,
            'date': req.body.date,
            'category': req.body.category
        }

        expense = await db.expense.create(expense)
        res.send(expense)

    }, 

    update: async (req, res) => {
        function validExtOfficer(expense){
            const schema = Joi.object({
                amount:Joi.number().allow(null),
                category:Joi.string().allow(null),
                date: Joi.date().allow(null),
                description: Joi.string().allow(null),
            }).unknown(true)
            return schema.validate(expense)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         expense = {
            'amount': req.body.amount,
            'category': req.body.category,
            'date': req.body.date,
            'description': req.body.description,
        }

        expense = await db.expense.update(expense, {
            where:{id : req.params.id}
        })

        res.send(expense)
    }, 

    delete: async(req, res) =>{
       let expense = await db.expense.destroy({
            where: {
              id: req.params.id
            }
          });
          res.sendStatus(200)
        },

    // ***************************************************start
    merge: async(req, res) =>{

        try {
            let expenses =  await db.expense.findAll({
                where:{merged:false}
            })
        
            const ledgerPromises = expenses.map(expense => lc.createLedgerInt(
                {
                    'category': expense.category,
                    'description': expense.description,
                    'receivable_src': null,
                    'payable_dest': expense.category,
                    'account_no': '000 000 0000',
                    'credit': 0,
                    'debit': expense.amount,
                }
            ));
        
            await Promise.all(ledgerPromises);
        
            await db.expense.update({ merged: true }, {
              where: {
                id: expenses.map(expense => expense.id),
              },
            });
        
            await lc.updateBalance();
            res.send('expenses merged and ledgers created successfully.');
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
     // ***********************************************SEARCH
     search: async (req, res) => {
        function isValidDate(dateString) {
            const regexDate = /^\d{4}-\d{2}-\d{2}$/;
            return regexDate.test(dateString);
        }
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })
        const {searchValue, startDate, endDate} = req.body

        const whereClause = {
            ledgerHeadId: activeLedger_head.id
        };

        if (searchValue) {
            if (isValidDate(searchValue)) {
              whereClause.date = searchValue;
            } else {
              whereClause[Op.or] = [
                { description: { [Op.like]: `%${searchValue}%` } },
                { category: { [Op.like]: `%${searchValue}%` } },
                // Add more columns as needed
              ];
            }
          }

        if (startDate && endDate) {
            whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        }
    
        const searchResults = await db.expense.findAll({
            where: whereClause,
        });
     
        res.send(searchResults)
    }
    
}