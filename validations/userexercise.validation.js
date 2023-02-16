const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
    body: Joi.object().keys({
        categoryid: Joi.string().required().custom(objectId),
        exerciseid: Joi.string().required().custom(objectId),
        user: Joi.string().required().custom(objectId),
        details: Joi.object().required(),
    }),
};

const get = {
    query: Joi.object().keys({
        select: Joi.string(),
        page: Joi.number(),
        limit: Joi.number(),
        populate: Joi.string(),
        category: Joi.string(),
        user: Joi.string(),
        exercise: Joi.string(),
    }),
};


module.exports = {
    create,
    get
}