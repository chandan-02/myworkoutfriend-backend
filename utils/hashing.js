const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

exports.comparePassword = async (newPassword, oldPassword) => {
    return await bcrypt.compare(newPassword, oldPassword);
};