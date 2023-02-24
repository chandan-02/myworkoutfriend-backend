const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        type: Joi.string().required().valid('public', 'private'),
        userid: Joi.string().required().custom(objectId)
    }),
};

const get = {
    query: Joi.object().keys({
        select: Joi.string(),
        page: Joi.number(),
        limit: Joi.number(),
        populate: Joi.string(),
        type: Joi.string().valid('public', 'private'),
        userid: Joi.string().custom(objectId),
    }),
};


module.exports = {
    create,
    get
}