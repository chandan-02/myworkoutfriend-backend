const mongoose = require("mongoose");

const excerciseScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        categoryid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
            trim: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("exercise", excerciseScheme);