const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const {Op, Sequelize } = require("sequelize")
require('dotenv').config()
const path = require('path');
const axios = require('axios');


module.exports = {


    getMembers: async(req, res)=>{
        let members = await db.member.findAll({})
        res.send(members)
    },

    create: async (req, res) => {
        function validExtOfficer(member){
            const schema = Joi.object({
                name:Joi.string().required(),
                phone:Joi.string().required(),
                phone_two: Joi.string().allow(null),
                dob: Joi.date().required(),
                status: Joi.string().valid('married', 'single','child'),
                ministry: Joi.string().required(),
                department: Joi.string().required(),
                cell: Joi.string().required(),
                location: Joi.string().required(),
                profession: Joi.string().allow(null)
            })
            return schema.validate(member)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         member = {
            'name': req.body.name,
            'phone': req.body.phone,
            'phone_two': req.body.phone_two,
            'dob': req.body.dob,
            'status': req.body.status,
            'location': req.body.location,
            'profession': req.body.profession,
            'ministry': req.body.ministry,
            'cell': req.body.cell,
            'department': req.body.department,

        }

        member = await db.member.create(member)

        res.send(member)
    }, 

    update: async (req, res) => {
        function validExtOfficer(member){
            const schema = Joi.object({
                name:Joi.string().allow(null),
                phone:Joi.string().allow(null),
                phone_two: Joi.string().allow(null),
                dob: Joi.date().allow(null),
                status: Joi.string().valid('married', 'single','child'),
                ministry: Joi.string().allow(null),
                department: Joi.string().allow(null),
                cell: Joi.string().allow(null),
                location: Joi.string().allow(null),
                profession: Joi.string().allow(null)
            }).unknown(true)
            return schema.validate(member)
        }
        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

         member = {
            'name': req.body.name,
            'phone': req.body.phone,
            'phone_two': req.body.phone_two,
            'dob': req.body.dob,
            'status': req.body.status,
            'location': req.body.location,
            'profession': req.body.profession,
            'ministry': req.body.ministry,
            'cell': req.body.cell,
            'department': req.body.department
        }

        member = await db.member.update(member, {
            where:{id : req.params.id}
        })

        res.send(member)
    }, 
    delete: async(req, res) =>{
       let member = await db.member.destroy({
            where: {
              id: req.params.id
            }
          });
          res.sendStatus(200)
    },
     // ***********************************************SEARCH
     search: async (req, res) => {
        const {searchValue, startDate, endDate} = req.body

        const whereClause = {};
        
        if (searchValue) {
              whereClause[Op.or] = [
                { name: { [Op.like]: `%${searchValue}%` } },
                { phone: { [Op.like]: `%${searchValue}%` } },
                { phone_two: { [Op.like]: `%${searchValue}%` } },
                { dob: { [Op.like]: `%${searchValue}%` } },
                { status: { [Op.like]: `%${searchValue}%` } },
                { cell: { [Op.like]: `%${searchValue}%` } },
                { department: { [Op.like]: `%${searchValue}%` } },
                { ministry: { [Op.like]: `%${searchValue}%` } },
                { location: { [Op.like]: `%${searchValue}%` } },
                { profession: { [Op.like]: `%${searchValue}%` } },
                // Add more columns as needed
              ]
          }

        if (startDate && endDate) {
            whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        }
    
        const searchResults = await db.member.findAll({
            where: whereClause,
        });
     
        res.send(searchResults)
    },
    sendMessage: async (req, res) => { 
        axios.post('https://api.mnotify.com/api/sms/quick?key=tAUkX60KwFyFKzxCv4YZKdGH3', 
        {
            recipient: [req.body.recipient],
            sender: 'GGC A/G',
            message: req.body.message,
            is_schedule: 'false',
            schedule_date: ''
        })
        .then(response => {
            res.send(response.data)
        })
        .catch(error =>{
            console.log(error)
        })
    }
}