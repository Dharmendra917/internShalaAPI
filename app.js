require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

// db connection
require("./models/database").connectDatabase();

//logger
const logger = require("morgan");
app.use(logger("tiny"));

//bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session and  cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

// cookie - (it actives cookes)Cookies are used to generate token on the backend, which is then stored in the user's browser. This code remains in the browser until the user logs in, and it typically expires when the session ends.
app.use(cookieparser());

// express file-uploader
const fileupload = require("express-fileupload");
app.use(fileupload());

// routes
app.use("/user", require("./routes/indexRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));

// error handling
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedError } = require("./middlewares/error");
const cookieParser = require("cookie-parser");
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested Url not found ${req.url}`, 404));
});
app.use(generatedError);

app.listen(
  process.env.PORT,
  console.log(`Server running on port : ${process.env.PORT}`)
);
