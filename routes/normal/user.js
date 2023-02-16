const express = require('express');
const auth = require('../../middleware/apiAuth');
const studentValidation = require('../../validations/normal.validation');
const userController = require('../../controllers/normal');
const validate = require('../../middleware/validate');

const router = express.Router();

router.route('/').post(validate(studentValidation.createUser), userController.createNewStudent);
router.route('/single/:id').get(validate(studentValidation.getSingleUserQuery), userController.getSingleStudent);
router.route('/:id').put(validate(studentValidation.updateUser), userController.updateStudent);

router.route('/login').post(validate(studentValidation.loginUser), userController.loginStudent);
router.route('/request-reset-password-token').post(validate(studentValidation.forgotPassword), userController.forgetPasswordToken);
router.route('/reset-password/:token').put(validate(studentValidation.resetPassword), userController.resetPasswordWithToken);

router.route('/resend-verify-email/:id').post(validate(studentValidation.resendEmailVerify), userController.resendVerificationEmail);
router.route('/verify-email/:token').get(validate(studentValidation.verifyEmail), userController.verifyEmail);


module.exports = router;