const _ = require('lodash')
const db = require('../models')
const Joi = require('joi')
const {Op, Sequelize } = require("sequelize")
require('dotenv').config()
const path = require('path');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = {


    getUsers: async(req, res)=>{
        let users = await db.user.findAll({
          attributes:['id', 'username']
        })
        res.send(users)
    },

    findUser:  async (req, res) => {
      res.send(req.auth)
    },
    create: async (req, res) => {

        function validExtOfficer(user){
            const schema = Joi.object({
                username:Joi.string().required(),
                password:Joi.string().required(),
                repeat_password: Joi.ref('password')
            })
            .with('password', 'repeat_password')

            return schema.validate(user)
        }

        const validate = validExtOfficer(req.body) 
        if (validate.error) return res.status(400).send(validate.error.details[0].message)

        let user = await db.user.findOne({where:{username:req.body.username}})
        if(user) return res.status(400).send('username already exists')

        user = {
            'password': req.body.password,
            'username': req.body.username,
        }
        
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        user = await db.user.create(user)
        
        const token = jwt.sign({ id: user.id, username: user.username },'&mikrobot_key@') 
        res.send(token)
    }, 
    update: async (req, res) => {

        if(req.body.password){
          function validUser(user){
            const schema = Joi.object({
                password:Joi.string().required(),
                repeat_password: Joi.ref('password')
            })
            .with('password', 'repeat_password')
      
            return schema.validate(user)
          }
          const validate = validUser(req.body) 
          if (validate.error) return res.status(400).send(validate.error.details[0].message)
        
          const salt = await bcrypt.genSalt(10)
          req.body.password = await bcrypt.hash(req.body.password, salt)
        }
  
        const user =  await db.user.update(req.body, {where:{id : req.params.id}});
        
        res.status(200)
    },

    
    delete: async(req, res) =>{
       let user = await db.user.destroy({
          where: {
            id: req.params.id
          }
        });
        res.sendStatus(200)  
    },

    login: async (req, res) => {
        let user = await db.user.findOne({where:{username:req.body.username}})
        if(!user) return res.status(400).send('invalid username')
    
        const validPass = await bcrypt.compare(req.body.password, user.password)
        if(!validPass) return res.status(400).send('invalid password')
    
        const token = jwt.sign({ id: user.id, username: user.username },'&mikrobot_key@') 
        res.json(token)
      },
}