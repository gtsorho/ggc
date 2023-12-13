const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const {Op, Sequelize } = require("sequelize")
require('dotenv').config()
const path = require('path');
const lc = require('./ledger_controller')


module.exports = {


    getIncome: async(req, res)=>{
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })
        let income = await db.income.findAll({
            where:{ledgerHeadId:activeLedger_head}
        })
        res.send(income)
    },

    create: async (req, res) => {
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })

        function validExtOfficer(income){
            const schema = Joi.object({
                amount:Joi.number().required(),
                category:Joi.string().required(),
                date: Joi.date().required()
            })
            return schema.validate(income)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         income = {
            'ledgerHeadId':activeLedger_head.id,
            'amount': req.body.amount,
            'date': req.body.date,
            'category': req.body.category
        }

        income = await db.income.create(income)
        res.send(income)
    }, 
    
    update: async (req, res) => {
        function validExtOfficer(income){
            const schema = Joi.object({
                amount:Joi.number().allow(null),
                category:Joi.string().allow(null),
                date: Joi.date().allow(null),
            }).unknown(true)
            return schema.validate(income)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         income = {
            'amount': req.body.amount,
            'category': req.body.category,
            'date': req.body.date,
        }

        income = await db.income.update(income, {
            where:{id : req.params.id}
        })

        res.send(income)
    }, 

    delete: async(req, res) =>{
       let income = await db.income.destroy({
            where: {
              id: req.params.id
            }
          });
          res.sendStatus(200)
    },

    // ***************************************************start
    merge: async(req, res) =>{

        try {
            let incomes =  await db.income.findAll({
                where:{merged:false}
            })
        
            const ledgerPromises = incomes.map(income => lc.createLedgerInt(
                {
                    'category': income.category,
                    'description': income.category,
                    'receivable_src': 'accounts',
                    'payable_dest': null,
                    'account_no': '000 000 0000',
                    'credit': income.amount,
                    'debit': 0,
                }
            ));
        
            await Promise.all(ledgerPromises);
        
            await db.income.update({ merged: true }, {
              where: {
                id: incomes.map(income => income.id),
              },
            });
            
            await lc.updateBalance();
            res.send('incomes merged and ledgers created successfully.');
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
            ledgerHeadId: activeLedger_head
        };        
        if (searchValue) {
            if (isValidDate(searchValue)) {
              whereClause.date = searchValue;
            } else {
              whereClause[Op.or] = [
                { category: { [Op.like]: `%${searchValue}%` } },
                // Add more columns as needed
              ];
            }
          }

        if (startDate && endDate) {
            whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        }
    
        const searchResults = await db.income.findAll({
            where: whereClause,
        });
     
        res.send(searchResults)
    }
}