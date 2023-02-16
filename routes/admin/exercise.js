const express = require('express');
const auth = require('../../middleware/apiAuth');
const Exercise = require('../../validations/exercise.validation');
const ExerciseController = require('../../controllers/excercise');
const validate = require('../../middleware/validate');

const router = express.Router();

router.route('/').post(validate(Exercise.create), ExerciseController.createExercise);
router.route('/').get(validate(Exercise.get), ExerciseController.getAllExercise);

module.exports = router;