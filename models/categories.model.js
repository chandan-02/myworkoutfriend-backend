const mongoose = require("mongoose");

const CategoryScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["public", "private"],
            required: true,
            trim: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("category", CategoryScheme);