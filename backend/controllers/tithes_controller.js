const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const {Op, Sequelize } = require("sequelize")
require('dotenv').config()
const path = require('path');
const lc = require('./ledger_controller')
const mc = require('./members_controller')
const axios  = require('axios')


module.exports = {


    getTithes: async(req, res)=>{
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })

        let tithes = await db.tithe.findAll({
            where:{ledgerHeadId:activeLedger_head.id},
            include:db.member
        })
        res.send(tithes)
    },

    create: async (req, res) => {
        let activeLedger_head = await db.ledger_head.findOne({
            where:{active:true}
        })

        function validExtOfficer(tithe){
            const schema = Joi.object({
                amount:Joi.number().required(),
                date: Joi.date().required(),
                memberId:Joi.number().required()
            })
            return schema.validate(tithe)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         tithe = {
            'ledgerHeadId':activeLedger_head.id,
            'memberId': req.body.memberId,
            'amount': req.body.amount,
            'date': req.body.date
        }

        tithe = await db.tithe.create(tithe)
        res.send(tithe)
    }, 
    update: async (req, res) => {
        function validExtOfficer(tithe){
            const schema = Joi.object({
                amount:Joi.number().allow(null),
                date: Joi.date().allow(null),
            }).unknown(true)
            return schema.validate(tithe)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         tithe = {
            'amount': req.body.amount,
            'date': req.body.date,
        }

        tithe = await db.tithe.update(tithe, {
            where:{id : req.params.id}
        })

        res.send(tithe)
    }, 

    delete: async(req, res) =>{
       let tithe = await db.tithe.destroy({
          where: {
            id: req.params.id
          }
        });
        res.sendStatus(200)  
    },
// *********************************************************
    merge: async(req, res) =>{
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];

        try {
            let tithes =  await db.tithe.findAll({
                where:{merged:false},
                include:db.member
            })
        
            const ledgerPromises = tithes.map(tithe => lc.createLedgerInt(
                {
                    'category': 'tithe',
                    'description': 'tithe' + months[new Date(tithe.date).getMonth()] ,
                    'receivable_src': tithe.member.name,
                    'payable_dest': null,
                    'account_no': tithe.member.phone,
                    'credit': tithe.amount,
                    'debit': 0,
                }
            ));
        
            await Promise.all(ledgerPromises);
        
            await db.tithe.update({ merged: true }, {
              where: {
                id: tithes.map(tithe => tithe.id),
              },
            });

            let messageOnTithe = await db.setting.findOne({
                where:{id:1}
            })

            let resMsg  = ''

            if(messageOnTithe.value === 'true' || messageOnTithe.value == true ){
                let body = {
                    recipient: tithes.map(tithe => tithe.member.phone),
                    message: `Hello ${tithes.map(tithe => tithe.member.name.split(' ')[0])}, \n\nYour Receipt TTE0${tithes.map(tithe => tithe.id)} of Tithe Paid: GHS${tithes.map(tithe => tithe.amount.toFixed(2))}.\nDate:${(tithes.map(tithe => new Date(tithe.date).toDateString()))} \n\n Thank you and have a Blessed Week`
                }  
                
                // send sms**************************************** https://apps.mnotify.net/smsapi?key=xxxxxxxxxx&to=xxxxxxx&msg=xxxxxxxx&sender_id=xxxxx 
                // axios.post('https://api.mnotify.com/api/sms/quick?key=tAUkX60KwFyFKzxCv4YZKdGH3', 
                // {
                //     recipient: body.recipient,
                //     sender: 'GGC A/G',
                //     message: body.message,
                //     is_schedule: 'false',
                //     schedule_date: ''
                // }
                // )
                // .then(response => {
                //      resMsg =  response.data
                // })
                // .catch(error =>{
                //     console.log(error)
                // })

                axios.get(`https://apps.mnotify.net/smsapi?key=v0lu4bVhQuMIU5hrxncAJ5WAE&to=${body.recipient[0]}&msg=${body.message}&sender_id=GGC A/G`)
                .then(response => {
                     resMsg =  response.data
                })
                .catch(error =>{
                    console.log(error)
                })


                // End send sms****************************************

            }

            await lc.updateBalance();
            res.send('created successfully. ' + resMsg);
        } catch (error) {
            res.status(400).send(error.message)
        } 
    },

    search: async (req, res) => {
      function isValidDate(dateString) {
          const regexDate = /^\d{4}-\d{2}-\d{2}$/;
          return regexDate.test(dateString);
      }
  
      let activeLedger_head = await db.ledger_head.findOne({
        where:{active:true}
      })

      const { searchValue, startDate, endDate } = req.body;
  
      const whereClause = {
        ledgerHeadId: activeLedger_head.id
      };
  
      if (searchValue) {
          if (isValidDate(searchValue)) {
              whereClause[Op.or] = [
                  { '$tithes.date$': searchValue },
              ];
          } else {
              whereClause[Op.or] = [
                  { '$member.name$': { [Op.like]: `%${searchValue}%` } },
              ];
          }
      }
  
      if (startDate && endDate) {
          whereClause[Op.and] = [
              { '$tithes.createdAt$': { [Op.between]: [startDate, endDate] } },
          ];
      }
  
      const searchResults = await db.tithe.findAll({
          include: [
              {
                  model: db.member,
                  attributes: ['id', 'name'],
                  where: whereClause,
              },
          ],
      });
  
      res.send(searchResults);
  }
  
}