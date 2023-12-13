const db = require('../models')
const Joi = require('joi')


module.exports = {

    getSettings: async(req, res)=>{
        let settings = await db.setting.findAll({})
        res.send(settings)
    },
    update: async (req, res) => {
      function validSetting(setting){
        const schema = Joi.object({
          value:Joi.required(),
        }).unknown(true)      
        return schema.validate(setting)
      }
      const validate = validSetting(req.body) 
      if (validate.error) return res.status(400).send(validate.error.details[0].message)

      const setting =  await db.setting.update({'value':req.body.value.toString()}, {where:{id : req.params.id}});

      res.status(200).send('update effective')
    },

}