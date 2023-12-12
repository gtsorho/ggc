const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const {Op, Sequelize } = require("sequelize")
require('dotenv').config()
const path = require('path');


module.exports = {


    getRecords: async(req, res)=>{
        let records = await db.record.findAll({})
        res.send(records)
    },

    

     // ***********************************************SEARCH
     search: async (req, res) => {

        const {startDate, endDate} = req.body
        const whereClause = {};
        
        if (startDate && endDate) {
            whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        }

        let lastEntry = await db.ledger.findOne({
            where: whereClause,
            order: [['id', 'DESC']],
        });

        // const searchDebts = await db.debt.findAll({
        //     where: whereClause,
        // });

        // expense********************************************

        const totalExpensesSum = await db.expense.sum('amount', { where: whereClause });
        const monthlyExpensesSum = await db.expense.findAll({
          attributes: [
            [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
            [db.sequelize.fn('MONTH', db.sequelize.col('date')), 'month'],
          ],
          group: ['month'],
          where: whereClause,
        });
        
        const categoryExpensesSum = await db.expense.findAll({
          attributes: [
            'category',
            [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
          ],
          group: ['category'],
          where: whereClause,
        });
        //end expense********************************************
        
        // debts *******************************************************
        const totalDebtBalance = await db.debt.findAll({
            attributes: [
              [db.sequelize.literal('SUM(CASE WHEN merged = true THEN balance ELSE amount END)'), 'totalDebtBalance'],
            ],
            where: whereClause,
          });

          const totalPaid = await db.debt.findAll({
            attributes: [
              [db.sequelize.literal('SUM(CASE WHEN merged = true THEN paid ELSE 0 END)'), 'totalPaid'],
            ],
            where: whereClause,
          });
          
          const monthlyDebtSum = await db.debt.findAll({
            attributes: [
              [db.sequelize.literal('SUM(CASE WHEN merged = true THEN balance ELSE amount END)'), 'total'],
              [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), 'month'],
            ],
            group: ['month'],
            where: whereClause,
          });
          
          const categoryDebtSum = await db.debt.findAll({
            attributes: [
              'category',
              [db.sequelize.literal('SUM(CASE WHEN merged = true THEN balance ELSE amount END)'), 'total'],
            ],
            group: ['category'],
            where: whereClause,
          });

        // end debts*********************************************

        // income **************************************
            const totalIncomeSum = await db.income.sum('amount', { where: whereClause });

            const monthlyIncomeSum = await db.income.findAll({
            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
                [db.sequelize.fn('MONTH', db.sequelize.col('date')), 'month'],
            ],
            group: ['month'],
            where: whereClause,
            });

            const categoryIncomeSum = await db.income.findAll({
            attributes: [
                'category',
                [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
            ],
            group: ['category'],
            where: whereClause,
            });


        // end income*****************************************

        // tithe************************************************
        const totalTitheSum = await db.tithe.sum('amount', { where: whereClause });

        const monthlyTitheSum = await db.tithe.findAll({
        attributes: [
            [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
            [db.sequelize.fn('MONTH', db.sequelize.col('date')), 'month'],
        ],
        group: ['month'],
        where: whereClause,
        });

        const categoryTitheSum = await db.tithe.findAll({
          attributes: [
              ['memberId', 'memberId'],
              [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'memberSum'],
          ],
          group: ['memberId'], // Group by the memberId
          where: whereClause,
          include: [{
              model: db.member,
              attributes: ['name'], // Include the member model to get member details
          }],
      });
      
        // const categoryTitheSum = await db.tithe.findAll({
        // attributes: [
        //     'category',
        //     [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'categorySum'],
        // ],
        // group: ['category'],
        // where: whereClause,
        // });

        // tithe end ************************************************


        let result = {
          'lastEntry':lastEntry,
          totalExpensesSum,
          monthlyExpensesSum,
          categoryExpensesSum,

          totalDebtBalance,
          monthlyDebtSum,
          categoryDebtSum,
          totalPaid,

          totalIncomeSum,
          monthlyIncomeSum,
          categoryIncomeSum,

          totalTitheSum,
          monthlyTitheSum,
          categoryTitheSum
        };
        
        res.send(result)
    }
}