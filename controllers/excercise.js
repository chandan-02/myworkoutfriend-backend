const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { createFilter } = require('../utils/filter');
//models
const { Exercise } = require('../models/index');

exports.createExercise = asyncHandler(async (req, res) => {
    try {
        const ExerciseData = await Exercise.create(req.body);
        return res.status(httpStatus.CREATED).json({ success: true, data: ExerciseData });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});


exports.getAllExercise = asyncHandler(async (req, res) => {
    const { page, limit, select, populate, category } = req.query;
    try {
        const filter = createFilter([
            { name: 'categoryid', value: category }
        ]);
        const exerciseData = await Exercise.find({ ...filter }).select(select?.split(",")).limit(Number(limit)).skip(Number(page) * Number(limit)).sort({ createdAt: -1 }).populate(populate?.split(","));;
        return res.status(httpStatus.OK).json({ success: true, data: exerciseData });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});


