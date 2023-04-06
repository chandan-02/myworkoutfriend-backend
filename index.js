const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const httpStatus = require('http-status')

require('dotenv').config()

const ApiError = require('./utils/ApiError');
const { authLimiter } = require('./middleware/rateLimiter');
const connectDB = require("./config/db");
const { errorHandler, errorConverter } = require("./middleware/errorHandler");
const Routes = require('./routes/index.js');

const app = express();

// enable cors
// var whitelist = ['*', 'http://localhost:3000']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }, credentials: true, allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization"
// }
app.use(cors());
// app.options('*', cors());


//  Logging Middleware 
app.use(morgan("dev"));

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// parse cookies
app.use(cookieParser());

// --------------------------------- body parser setup ---------------------------------
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


// limit repeated failed requests to auth endpoints
if (process.env.NODE_ENV === 'production') {
  app.use('/v1/auth', authLimiter);
}

//  --------------------------------- main route setup ---------------------------------
app.use("/api/v1", Routes);

// --------------------------------- send back a 404 error for any unknown api request ---------------------------------
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Api Route Not found'));
});
// --------------------------------- error handler ---------------------------------
// convert error to ApiError, if needed
// app.use(errorConverter);

// handle error
app.use(errorHandler);

// --------------------------------- Express App setup ---------------------------------
const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(
    chalk.yellowBright.bold(
      `Server is running on PORT: ${PORT}, on mode ${process.env.NODE_ENV}.`
    )
  );
  console.log(
    chalk.blueBright.bold(`API DOC available here : ${process.env.VERIFY_URL}/api/v1/docs`)
  )
});

// --------------------------------- Handle unhandled Promise rejections ---------------------------------
process.on("unhandledRejection", (err) => {
  console.log(chalk.bold.redBright(`Error: ${err.message}`));
  console.log(err);
  server.close(() => {
    console.log(
      chalk.bold.redBright("Server closed due to unhandled promise rejection")
    );
    process.exit(1);
  });
});
