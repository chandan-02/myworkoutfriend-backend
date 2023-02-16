const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { createFilter } = require('../utils/filter');
const moment = require('moment')
//models
const { Exercise, UserExercise } = require('../models/index');

exports.createUserExercise = asyncHandler(async (req, res) => {
    try {
        const exerciseToday = await UserExercise.findOne({ exerciseid: req.body.exerciseid });
        if (!exerciseToday || moment(exerciseToday.createdAt).format('DD-MM-YYYY') !== moment().format('DD-MM-YYYY')) {
            const ExerciseData = await UserExercise.create(req.body);
            return res.status(httpStatus.CREATED).json({ success: true, data: ExerciseData });
        }
        Object.assign(exerciseToday, { details: [...exerciseToday.details, req.body?.details] });
        exerciseToday.save();
        return res.status(httpStatus.CREATED).json({ success: true, data: exerciseToday });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});


exports.getAllUserExercise = asyncHandler(async (req, res) => {
    const { page, limit, select, populate, category, user, exercise } = req.query;
    try {
        const filter = createFilter([
            { name: 'categoryid', value: category },
            { name: 'user', value: user },
            { name: 'exerciseid', value: exercise },
        ]);
        const exerciseData = await UserExercise.find({ ...filter }).select(select?.split(",")).limit(Number(limit)).skip(Number(page) * Number(limit)).sort({ createdAt: -1 }).populate(populate?.split(","));;
        return res.status(httpStatus.OK).json({ success: true, data: exerciseData });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});


