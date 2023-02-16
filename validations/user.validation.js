const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    fullname: Joi.string().required(),
    height: Joi.string(),
    weight: Joi.string(),
    fullname: Joi.string().required(),
    role: Joi.string().required().valid('normal', 'admin'),
    mobile: Joi.number().min(10).required(),
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
    role: Joi.string().valid('normal', 'admin'),
    mobile: Joi.number().min(10)
  }),
};

const loginUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
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

const getSingleUserQuery = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  }),
  query: Joi.object().keys({
    select: Joi.string(),
    populate: Joi.string(),
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

module.exports = {
  createUser,
  getUserQuery,
  getSingleUserQuery,
  updateUser,
  loginUser,
  forgotPassword,
  resetPassword,
  resendEmailVerify,
  verifyEmail
}
