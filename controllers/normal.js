const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const moment = require('moment');

const { sendEmail } = require('../utils/sendEmail');
const { verifyEmailTemlate, forgotPasswordTemplate } = require('../email_temlates/email.verify.template');
const { generateToken, tokenTypes, verifyToken } = require('../utils/token')

//models
const { Student } = require('../models/index');

exports.createNewStudent = asyncHandler(async (req, res) => {
    try {
        // create user
        const userCreation = await Student.create(req.body);
        // generate verification token
        const expires = moment().add(process.env.EMAIL_VERIFICATION_DAYS, 'days');
        const token = generateToken(userCreation._id, expires, tokenTypes.EMAIL_VERIFICATION);

        const newStudent = await Student.findOneAndUpdate({ _id: userCreation._id }, { token });
        const verifyUrl = `${process.env.VERIFY_URL}/api/v1/student/user/verify-email/${token}`;
        // send email
        await sendEmail('Email Verification', verifyEmailTemlate(verifyUrl), userCreation.email)
        // send resonse
        return res.status(201).json({ success: true, data: newStudent });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});

exports.updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const StudentUser = await Student.findOne({ _id: id });
        Object.assign(StudentUser, req.body);
        await StudentUser.save();
        return res.status(201).json({ success: true, data: StudentUser });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
})

exports.loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const userData = await Student.findOne({ email });
        if (!userData || !(await userData.isPasswordMatch(password))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, `Incorrect email or password`);
        }
        if (!userData?.isverified) {
            throw new ApiError(httpStatus.UNAUTHORIZED, `Please verify your email before login.`);
        }
        const expires = moment().add(30, 'days');
        const token = generateToken(userData._id, expires, tokenTypes.ACCESS);
        return res.status(200).json({ success: true, data: userData, meta: { jwt: token } });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
})

exports.verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    try {
        const { tokenDoc, payload } = await verifyToken(Student, token);
        console.log(tokenDoc)
        if (payload?.type !== tokenTypes.EMAIL_VERIFICATION) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token')
        }
        Object.assign(tokenDoc, { isverified: true, token: "" });
        tokenDoc.save();
        return res.status(200).send("Email verified successfully");
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});

exports.resendVerificationEmail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const StudentUser = await Student.findOne({ _id: id });

        // generate verification token
        const expires = moment().add(process.env.EMAIL_VERIFICATION_DAYS, 'days');
        const token = generateToken(StudentUser._id, expires, tokenTypes.EMAIL_VERIFICATION);

        const verifyUrl = `${process.env.VERIFY_URL}/api/v1/student/user/verify-email/${token}`;
        Object.assign(StudentUser, { token });
        StudentUser.save();

        await sendEmail('Email Verification', verifyEmailTemlate(verifyUrl), StudentUser.email)
        return res.status(201).json({ success: true, data: "Verification email sent successfully", meta: { temp: verifyUrl } });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});

exports.getSingleStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { select, populate } = req.query;
    if (!id) {
        throw new ErrorResponse(`Please provide a user id `, 400);
    }
    try {
        const userData = await Student.findOne({ _id: id }).select(select?.split(",")).populate(populate?.split(","));;
        return res.status(200).json({ success: true, data: userData })
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});

exports.deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ErrorResponse(`Please provide a user id `, 400);
    }
    try {
        await Student.deleteOne({ _id: id });
        return res.status(200).json({ success: true, data: "Student deleted successfully" })
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});

exports.getAllStudent = asyncHandler(async (req, res) => {
    const { select, page, limit, populate } = req.query;
    try {
        const userData = await Student.find({}).select(select?.split(",")).limit(Number(limit)).skip(Number(page) * Number(limit)).sort({ createdAt: -1 }).populate(populate?.split(","));
        return res.status(200).json({ success: true, data: userData })
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});

exports.forgetPasswordToken = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await Student.findOne({ email: email });
        if (!userData) {
            throw new ErrorResponse("Email not found", 404);
        }
        const expires = moment().add(30, 'days');
        const token = generateToken(userData._id, expires, tokenTypes.RESET_PASSWORD);
        await sendEmail("Forget Password", forgotPasswordTemplate(token), userData.email);
        Object.assign(userData, { token })
        userData.save();
        return res.status(200).json({ success: true, data: "Email sent successfully", meta: { temp: token } });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});

exports.resetPasswordWithToken = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    try {
        const { tokenDoc, payload } = await verifyToken(Student, token);
        console.log(tokenDoc)
        if (payload?.type !== tokenTypes.RESET_PASSWORD) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token')
        }
        Object.assign(tokenDoc, { password, token: "" });
        tokenDoc.save();
        return res.status(200).json({ success: true, data: "Password updated successfully" });
    } catch (error) {
        throw new ApiError(`Server error :${error}`, httpStatus.INTERNAL_SERVER_ERROR);
    }
});
