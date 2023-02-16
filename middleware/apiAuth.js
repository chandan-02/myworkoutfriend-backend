const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/ErrorResponse');
const validate = require('../middleware/validate');

//Models
const { Staff } = require("../models/index");

/*
* Main JWT Auth 
*/
exports.ApiAuthentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        throw new ErrorResponse(`unauthorized, please provide a valid jwt token`, 401);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, response) => {
        if (err) {
            throw new ErrorResponse(`token expired or invalid token, please try again with valid jwt token`, 403);
        }
        req.user = response;
        next();
    })
}
