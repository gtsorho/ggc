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

    create: async (req, res) => {
        function validExtOfficer(record){
            const schema = Joi.object({
                attendance:Joi.number().allow(null),
                vips:Joi.number().allow(null),
                offering: Joi.number().allow(null),
                tithe: Joi.number().allow(null),
                seed: Joi.number().allow(null),
                welfare: Joi.number().allow(null),
                thanksgiving: Joi.number().allow(null),
                date: Joi.date().required(null)                
            })
            return schema.validate(record)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         record = {
            'attendance': req.body.attendance,
            'vips': req.body.vips,
            'offering': req.body.offering,
            'tithe': req.body.tithe,
            'seed': req.body.seed,
            'welfare': req.body.welfare,
            'thanksgiving': req.body.thanksgiving,
            'date': req.body.date,
        }

        record = await db.record.create(record)

        res.send(record)
    }, 

    update: async (req, res) => {
        function validExtOfficer(record){
            const schema = Joi.object({
                attendance:Joi.number().allow(null),
                vips:Joi.number().allow(null),
                offering: Joi.number().allow(null),
                tithe: Joi.number().allow(null),
                seed: Joi.number().allow(null),
                welfare: Joi.number().allow(null),
                thanksgiving: Joi.number().allow(null),
                date: Joi.date().required(null) 
            }).unknown(true)
            return schema.validate(record)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         record = {
            'attendance': req.body.attendance,
            'vips': req.body.vips,
            'offering': req.body.offering,
            'tithe': req.body.tithe,
            'seed': req.body.seed,
            'welfare': req.body.welfare,
            'thanksgiving': req.body.thanksgiving,
            'date': req.body.date,
        }

        record = await db.record.update(record, {
            where:{id : req.params.id}
        })

        res.send(record)
    }, 
    delete: async(req, res) =>{
       let record = await db.record.destroy({
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

        const whereClause = {};
        
        if (searchValue) {
            if (isValidDate(searchValue)) {
              whereClause.date = searchValue;
            }
          }

        if (startDate && endDate) {
            whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        }
    
        const searchResults = await db.record.findAll({
            where: whereClause,
        });
     
        res.send(searchResults)
    }
}