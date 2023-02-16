const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const normalUserScheme = new mongoose.Schema(
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
        courses: [{
            courseid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "course"
            },
            totalcontent: {
                type: Number,
            },
            consumed: {
                type: Number,
            },
            status: {
                type: String,
            },
        }],
        isverified: {
            type: Boolean,
            default: false,
        },
        playgroundarvr: {
            type: Boolean,
            default: false,
        },
        playgroundai: {
            type: Boolean,
            default: false,
        },
        githubid: {
            type: String,
            trim: true,
        },
        googleid: {
            type: String,
            trim: true,
        },
        organizationid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "organization"
        },
        token: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

normalUserScheme.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

normalUserScheme.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

normalUserScheme.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

module.exports = mongoose.model("normaluser", normalUserScheme);
