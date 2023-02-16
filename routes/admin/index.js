const express = require("express");
const router = express.Router();

// Routes 
const userRouter = require('./user');
const CategoryRouter = require('./category');
const ExerciseRouter = require('./exercise');
const UserExerciseRouter = require('./userexercise');

router.use('/user', userRouter);
router.use('/category', CategoryRouter);
router.use('/exercise', ExerciseRouter);
router.use('/user-exercise', UserExerciseRouter);

module.exports = router;