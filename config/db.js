const mongoose = require("mongoose");
// const express = require("express");
// const req = express();
const chalk = require("chalk");

module.exports = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_CONNECTION_STRING}`,//connection string
      {
        //   useCreateIndex: true,
        //   useFindAndModify: false,
        useNewUrlParser: true,
        //   useUnifiedTopology: true,
      }
    );
    console.log(
      chalk.blueBright.underline(
        `Database Connected (${conn.connection.name}): ${conn.connection.host}`
      )
    );
    console.log(
      chalk.bgRedBright.underline(
        `If you are running server on localhost Change then mongodb database url --> config/db.js`
      )
    );
    return conn.connection.db;
  } catch (err) {
    console.log(chalk.bold.redBright(`Error: ${err.message}`));
    console.log(chalk.bold.redBright(`Database not Connected`));
    // throw new Error("Database not Connected");
  }
};
