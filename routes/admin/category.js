const express = require('express');
const auth = require('../../middleware/apiAuth');
const CategoryValidation = require('../../validations/category.validation');
const CategoryController = require('../../controllers/category');
const validate = require('../../middleware/validate');

const router = express.Router();

router.route('/').post(validate(CategoryValidation.create), CategoryController.createCategory);
router.route('/').get(validate(CategoryValidation.get), CategoryController.getAllCategory);
router.route('/:id').delete(validate(CategoryValidation.deleteCat), CategoryController.deleteCat);

module.exports = router;