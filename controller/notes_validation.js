const Joi = require('joi')

const create_notes_schema = Joi.object({
    title: Joi.string().min(4).message('title must be at least 4 characters').required(),
    description: Joi.string().min(4).message('description must be at least 5 characters').required(),
    tag: Joi.string().min(3).message('tag must be at least 3 characters').required()
})

module.exports = create_notes_schema