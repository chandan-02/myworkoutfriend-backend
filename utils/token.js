const moment = require('moment');
const jwt = require("jsonwebtoken");
const generateToken = (userId, expires, type, secret = process.env.JWTSECRET) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

const verifyToken = async (Model, token) => {
    const payload = jwt.verify(token, process.env.JWTSECRET);
    const tokenDoc = await Model.findOne({ token, _id: payload.sub });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return { tokenDoc, payload };
};

const tokenTypes = {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'resetPassword',
    EMAIL_VERIFICATION: 'emailVerification',
};

module.exports = {
    generateToken,
    tokenTypes,
    verifyToken
}