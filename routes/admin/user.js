const express = require('express');
const auth = require('../../middleware/apiAuth');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user');
const validate = require('../../middleware/validate');

const router = express.Router();

router.route('/').post(validate(userValidation.createUser), userController.createNewUser);
router.route('/').get(validate(userValidation.getUserQuery), userController.getAllUser);
router.route('/single/:id').get(validate(userValidation.getSingleUserQuery), userController.getSingleUser);
router.route('/:id').put(validate(userValidation.updateUser), userController.updateUser);
router.route('/plan/:id').put(validate(userValidation.updatePlan), userController.updateUser);
router.route('/:id').delete(userController.deleteUser);

router.route('/login').post(validate(userValidation.loginUser), userController.loginUser);
router.route('/request-reset-password-token').post(validate(userValidation.forgotPassword), userController.forgetPasswordToken);
router.route('/reset-password/:token').put(validate(userValidation.resetPassword), userController.resetPasswordWithToken);

router.route('/resend-verify-email/:id').post(validate(userValidation.resendEmailVerify), userController.resendVerificationEmail);
router.route('/verify-email/:token').get(validate(userValidation.verifyEmail), userController.verifyEmail);


module.exports = router;