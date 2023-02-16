const express = require("express");
const router = express.Router();

// Routes 
const userRouter = require('./user');


router.use('/user', userRouter);

module.exports = router;