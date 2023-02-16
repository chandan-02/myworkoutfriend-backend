const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        categoryid: Joi.string().required().custom(objectId),
    }),
};

const get = {
    query: Joi.object().keys({
        select: Joi.string(),
        page: Joi.number(),
        limit: Joi.number(),
        populate: Joi.string(),
        category: Joi.string(),
    }),
};


module.exports = {
    create,
    get
}