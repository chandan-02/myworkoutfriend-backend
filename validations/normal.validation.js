const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        fullname: Joi.string().required(),
        mobile: Joi.number().min(10).required()
    }),
};

const loginUser = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().custom(password).required(),
    }),
};

const resendEmailVerify = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(objectId)
    }),
};

const verifyEmail = {
    params: Joi.object().keys({
        token: Joi.string().required()
    }),
};

const getSingleUserQuery = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(objectId)
    }),
    query: Joi.object().keys({
        select: Joi.string(),
        populate: Joi.string(),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().custom(password),
        fullname: Joi.string(),
        mobile: Joi.number().min(10)
    }),
};

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};

const resetPassword = {
    params: Joi.object().keys({
        token: Joi.string().required()
    }),
    body: Joi.object().keys({
        password: Joi.string().custom(password),
    }),
};

const getUserQuery = {
    query: Joi.object().keys({
        select: Joi.string(),
        page: Joi.number(),
        limit: Joi.number(),
        populate: Joi.string(),
    }),
};

module.exports = {
    createUser,
    loginUser,
    verifyEmail,
    resendEmailVerify,
    getSingleUserQuery,
    updateUser,
    forgotPassword,
    resetPassword,
    getUserQuery
}