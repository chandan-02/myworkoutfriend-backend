const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { createFilter } = require('../utils/filter');
//models
const { Category } = require('../models/index');

exports.createCategory = asyncHandler(async (req, res) => {
    try {
        const CategoryData = await Category.create(req.body);
        return res.status(httpStatus.CREATED).json({ success: true, data: CategoryData });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});


exports.getAllCategory = asyncHandler(async (req, res) => {
    const { page, limit, select, populate } = req.query;
    try {
        const filter = createFilter([
            //add filters here
        ]);
        const CategoryData = await Category.find({ ...filter }).select(select?.split(",")).limit(Number(limit)).skip(Number(page) * Number(limit)).sort({ createdAt: -1 }).populate(populate?.split(","));;
        return res.status(httpStatus.OK).json({ success: true, data: CategoryData });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});


