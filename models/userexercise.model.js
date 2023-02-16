const mongoose = require("mongoose");

const excerciseScheme = new mongoose.Schema(
    {
        exerciseid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "exercise",
            required: true,
            trim: true,
        },
        categoryid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            trim: true,
        },
        details: [
            {
                set: { type: String },
                reps: { type: String },
                weight: { type: String },
                rpe: { type: String },
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("userexercise", excerciseScheme);