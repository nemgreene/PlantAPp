const passport = require("passport");
const UserModel = require("../model/model");
const localStrategy = require("passport-local").Strategy;

//Create a passport middleware to handle user registration
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      failureMessage: true,
    },
    async (req, email, password, done) => {
      let password1 = req.body.password,
        password2 = req.body.password2;
      try {
        // Missing field values
        if (!req.body.email || !req.body.password || !req.body.password2) {
          return done(null, 400, { error: "Fill out all the fields" });
        }
        //passwords do not match
        if (password1 !== password2) {
          return done(null, 400, { message: "Passwords do not match" });
        }
        // email already in use
        const exists = await UserModel.findOne({ email: req.body.email });
        if (exists) {
          return done(null, 409, { error: "Email already in use" });
        }
        //Save the information provided by the user to the the database
        const user = await UserModel.create({ email, password });
        //Send the user information to the next middleware
        return done(null, { ...user.toObject(), password });
      } catch (error) {
        return done(error);
      }
    }
  )
);

//Create a passport middleware to handle User login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        //Find the user associated with the email provided by the user
        const user = await UserModel.findOne({ email });
        if (!user) {
          //If the user isn't found in the database, return a message
          return done(null, false, { message: "User not found" });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        //Send the user information to the next middleware
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
