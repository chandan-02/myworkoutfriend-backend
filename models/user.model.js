const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const adminScheme = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
        },
        mobile: {
            type: Number,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "normal"],
            default: "normal",
            trim: true,
        },
        height: {
            type: String,
            default: null,
        },
        weight: {
            type: String,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
        isverified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

adminScheme.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

adminScheme.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

adminScheme.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

module.exports = mongoose.model("user", adminScheme);
