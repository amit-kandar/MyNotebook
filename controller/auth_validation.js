const Joi = require('joi')

const create_user_schema = Joi.object({
    name: Joi.string().min(3).message('name must be at least 3 characters').required(),
    email: Joi.string().email().message('Invalid email').required(),
    password: Joi.string().uppercase().lowercase().alphanum().required()
})
const user_login_schema = Joi.object({
    email: Joi.string().email().message('Invalid email').required(),
    password: Joi.string().uppercase().lowercase().alphanum().required().exist()
})

module.exports = { create_user_schema, user_login_schema }