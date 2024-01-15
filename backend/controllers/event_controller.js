const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const {Op, Sequelize } = require("sequelize")
require('dotenv').config()
const path = require('path');


module.exports = {


    getEvents: async(req, res)=>{
        let events = await db.event.findAll({})
        res.send(events)
    },

    getUpcoming: async(req, res)=>{
        const today = new Date()
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + parseInt(req.params.noDays))
        let events = await db.event.findAll({
            where:{
                start_date:{
                    [Op.between]:[today, futureDate]
                },
                completed:false
            }
        })
        res.send(events)
    },

    create: async (req, res) => {


        function validExtOfficer(event){
            const schema = Joi.object({
                subject:Joi.string().required(),
                description:Joi.string().required(),
                completed: Joi.boolean().allow(null),
                start_date: Joi.date().required(),
                end_date: Joi.date().required()                

            })
            return schema.validate(event)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

        let event = {
            'subject': req.body.subject,
            'description': req.body.description,
            'completed': req.body.completed,
            'start_date': req.body.start_date,
            'end_date': req.body.end_date,
        }

        event = await db.event.create(event)

        res.send(event)
    }, 

    update: async (req, res) => {
        function validExtOfficer(event){
            const schema = Joi.object({
                subject:Joi.string().allow(null),
                description:Joi.string().allow(null),
                completed: Joi.boolean().allow(null),
                start_date: Joi.date().allow(null),
                end_date: Joi.date().allow(null)    
            }).unknown(true)
            return schema.validate(event)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

        let event = await db.event.update(req.body, {
            where:{id : req.params.id}
        })

        res.send(event)
    }, 
    delete: async(req, res) =>{
       let event = await db.event.destroy({
            where: {
              id: req.params.id
            }
          });
          res.sendStatus(200)
    },
     // ***********************************************SEARCH
     search: async (req, res) => {
        function isValidDate(dateString) {
            const regexDate = /^\d{4}-\d{2}-\d{2}$/;
            return regexDate.test(dateString);
        }
        
        const {searchValue, startDate, endDate} = req.body
        
        if (searchValue) {
            whereClause[Op.or] = [
                { subject: { [Op.like]: `%${searchValue}%` } },
                // Add more columns as needed
            ];
          }

        if (startDate && endDate) {
            whereClause.start_date = { [Op.between]: [startDate, endDate] };
        }
    
        const searchResults = await db.event.findAll({
            where: whereClause,
        });
     
        res.send(searchResults)
    }
}