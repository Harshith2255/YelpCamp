const { number, string } = require('joi')
const joi =require('joi')

module.exports.campgroundJOISchema=joi.object({
    title:joi.string().required(),
    price:joi.number().required().min(1000),
    location:joi.string().required(),
    description:joi.string().required(), 
    deleteImages:joi.array()
})

module.exports.reviewJOISchema=joi.object({

    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        body:joi.string().required()
    }).required()
})