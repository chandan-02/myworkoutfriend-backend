const express = require('express');
const auth = require('../../middleware/apiAuth');
const UserExerciseValidation = require('../../validations/userexercise.validation');
const UserExerciseController = require('../../controllers/userexercise');
const validate = require('../../middleware/validate');

const router = express.Router();

router.route('/').post(validate(UserExerciseValidation.create), UserExerciseController.createUserExercise);
router.route('/').get(validate(UserExerciseValidation.get), UserExerciseController.getAllUserExercise);

module.exports = router;