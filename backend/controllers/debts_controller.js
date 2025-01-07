const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const { Op, Sequelize } = require("sequelize")
require('dotenv').config()
const path = require('path');
const lc = require('./ledger_controller')


module.exports = {


    getDebts: async(req, res)=>{
        let activeLedger_head = await db.ledger_head.findOne({
          where:{active:true}
        })
        let debts = await db.debt.findAll({
          where:{ledgerHeadId: activeLedger_head.id}
        })
        const result = await db.debt.findAll({
            where:{ledgerHeadId: activeLedger_head.id},
            attributes: [
              [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN merged = true THEN balance ELSE amount END')), 'totalBalance']
            ]
          });
      
          const totalBalance = result.get('totalBalance') || 0;
        res.send([debts, totalBalance])
    },

    create: async (req, res) => {
        let activeLedger_head = await db.ledger_head.findOne({
          where:{active:true}
        })
        function validExtOfficer(debt){
            const schema = Joi.object({
                amount:Joi.number().required(),
                creditor:Joi.string().required(),
                category:Joi.string().required(),
                due: Joi.date().required(),
                paid:Joi.number().allow(null)
            })
            return schema.validate(debt)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

        let balance = req.body.amount - req.body.paid

        debt = {
            'ledgerHeadId':activeLedger_head.id,
            'amount': req.body.amount,
            'creditor': req.body.creditor,
            'due': req.body.due,
            'category': req.body.category,
            'paid': req.body.paid,
            'balance':balance
        }

        dept = await db.debt.create(debt)
        res.send(dept)
    }, 
    update: async (req, res) => {
        function validExtOfficer(debt){
            const schema = Joi.object({
                amount:Joi.number().allow(null),
                creditor:Joi.string().allow(null),
                due: Joi.date().allow(null),
                category: Joi.string().allow(null),
                paid: Joi.number().allow(null),
            }).unknown(true)
            return schema.validate(debt)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

        let balance = req.body.amount - req.body.paid

         debt = {
            'amount': req.body.amount,
            'category': req.body.category,
            'due': req.body.due,
            'paid': req.body.paid,
            'creditor': req.body.creditor,
            'balance':balance,
            'merged':false
        }

        debt = await db.debt.update(debt, {
            where:{id : req.params.id}
        })

        res.send(debt)
    }, 

    delete: async(req, res) => {
       let debt = await db.debt.destroy({
            where: {
              id: req.params.id 
            }
          });
          console.log(debt)
        res.sendStatus(200)
    },

    // ***************************************************start
    // merge: async(req, res) =>{

    //     try {
    //         let debts =  await db.debt.findAll({
    //             where:{merged:false}
    //         })

    //         const ledgerPromises = debts.map((debt) => {

    //           let lastLedgerDebt = db.ledger.findOne({
    //             where:{table_ref:'debt_' + debt.id},
    //             order: [['createdAt', 'DESC']],
    //           })
  
    //           if (lastLedgerDebt) {
    //             debt.paid = debt.paid - lastLedgerDebt.paid;
    //           }
    //             lc.createLedgerInt(
    //               {
    //                   'category': debt.category,
    //                   'description': debt.category +' to '+ debt.creditor + ' total amount: ' + debt.amount + '. Balance is ' + debt.balance,
    //                   'receivable_src': null,
    //                   'payable_dest': debt.creditor,
    //                   'account_no': '000 000 0000',
    //                   'credit': 0,
    //                   'debit': debt.paid,
    //                   'table_ref':'debt_' + debt.id
    //               }
    //             )
    //           }
    //         );
        
    //         await Promise.all(ledgerPromises);
        
    //         await db.debt.update({ merged: true }, {
    //           where: {
    //             id: debts.map(debt => debt.id),
    //           },
    //         });
    //         await lc.updateBalance();
    //         res.send('Debts merged and ledgers created successfully.');
    //     } catch (error) {
    //         res.status(400).send(error.message)
    //     }
    // },
    merge: async (req, res) => {
      try {
        let debts = await db.debt.findAll({
          where: { merged: false }
        });
    
        const ledgerPromises = debts.map(async (debt) => {
          try {
            const lastLedgerDebt = await db.ledger.findOne({
              where: { table_ref: 'debt_' + debt.id },
              order: [['createdAt', 'DESC']]
            });
    
            if (lastLedgerDebt) {
              debt.paid = debt.paid - lastLedgerDebt.debit;
            }

             lc.createLedgerInt({
              'category': debt.category,
              'description': debt.category + ' to ' + debt.creditor + ' total amount: ' + debt.amount + '. Balance is ' + debt.balance,
              'receivable_src': null,
              'payable_dest': debt.creditor,
              'account_no': '000 000 0000',
              'credit': 0,
              'debit': debt.paid,
              'table_ref': 'debt_' + debt.id
            });
    
            console.log('Ledger entry created for debt:', debt.id);
          } catch (ledgerError) {
            console.error('Error creating ledger entry for debt:', debt.id, ledgerError);
          }
        });
    
        await Promise.all(ledgerPromises);
    
        await db.debt.update({ merged: true }, {
          where: {
            id: debts.map(debt => debt.id),
          },
        });
    
        await lc.updateBalance();
        res.send('Debts merged and ledgers created successfully.');
      } catch (error) {
        res.status(400).send(error.message);
      }
    },
    

    getDebtsWithinNext30Days: async (req, res)=>{
      const currentDate = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
      
      const debtsWithin30Days = await db.debt.findAll({
        where: {
          due: {
            [Op.between]: [currentDate, thirtyDaysFromNow],
          },
          amount: {
            [Op.gt]: Sequelize.col('balance'),
          },
        },
      });

      res.send(debtsWithin30Days);
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
              whereClause.due = searchValue;
            } else {
              whereClause[Op.or] = [
                { creditor: { [Op.like]: `%${searchValue}%` } },
                { category: { [Op.like]: `%${searchValue}%` } },
                // Add more columns as needed
              ];
            }
          }

        if (startDate && endDate) {
            whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        }
    
        const searchResults = await db.debt.findAll({
            where: whereClause,
        });
     
        res.send(searchResults)
    }

} 