const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const jwt_decode = require("jwt-decode");
let Token = require("../model/tokenModel");

// set jwt token expiry duration
const expiresIn = "10m";

// Begin public routes

// Register endpoint
router.post("/register", async (req, res, next) => {
  // call passport signup strategy
  passport.authenticate("signup", async (err, user, info) => {
    try {
      // if user is a number, treat it as a status code
      if (user && !isNaN(user)) {
        res.status(user).send(info);
      }
      // else user is user, respond with new users credentials
      if (user._id) {
        res.status(200).json({ ...user });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// Login endpoint
router.post("/login", async (req, res, next) => {
  // call passport login strategy
  passport.authenticate("login", async (err, user, info) => {
    try {
      // invalid credentials
      if (err || !user) {
        const error = new Error("Invalid Credentials");
        res.status(401);
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, email: user.email };
        //Sign the JWT tokens and populate the payload with the user email and id
        let accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn,
        });
        const refreshToken = jwt.sign(
          { user: body },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        // Store tokens in DB
        let dbToken = new Token({
          refreshToken: refreshToken,
          accessToken: accessToken,
        });
        dbToken.save().catch((err) => {
          res.send(err);
        });

        //Send back the token to the user
        return res.json({ accessToken, refreshToken, _id: user._id });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//hit route to refresh access token
router.get("/token", async function (req, res) {
  let { accesstoken, refreshtoken } = req.headers;
  //is there a refreshtoken? sure hope so
  if (refreshtoken === null) return res.json("No refresh Token");
  //lets find out if refresh token is in db
  let search = await Token.findOne({ refreshToken: refreshtoken });
  if (!search) {
    return res.status(401).send({ error: "Token not found" });
  }
  //if it is, lets see if refresh token is valid
  jwt.verify(
    refreshtoken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        return res.json("refreshtoken not valid");
      }
      //if we've come this far, we can know that the refresh token is valid
      //on to the next
      //create update access token(out of decoded refresh token)
      let data = jwt_decode(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
      let updatedAccessToken = jwt.sign(
        { data },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn,
        }
      );
      // update the token with the refresh token to reflect the new access token
      let removed = await Token.findOneAndUpdate(
        { refreshToken: refreshtoken },
        { accessToken: accesstoken }
      );
      // verify that a token was updated
      if (removed.updatedCount === 0) {
        return res.status(401).send({ error: "Token not found" });
      }
      accesstoken = updatedAccessToken;
      res.json({ accesstoken, refreshtoken });
    }
  );
});

// On logout, hit this endpoint to remove the token from the db
router.delete("/token", async function (req, res) {
  const { accesstoken, refreshtoken } = req.headers;
  // if missing credentials
  if (!accesstoken || !refreshtoken) {
    return {};
  } else {
    // delete all Tokens matching access and refresh tokens
    const access = await Token.deleteMany({ accessToken: accesstoken });
    const refresh = await Token.deleteMany({ refreshToken: refreshtoken });
    // verify server has acknowledged
    if (!access.acknowledged || !refresh.acknowledged) {
      res.status(500).send({ error: "Internal Server Error" });
    }
    // verify at least ond thing has been deleted
    if (!access.deletedCount && !refresh.deletedCount) {
      res.status(400).send({ error: "No matching tokens" });
    } else {
      res.send({ message: "Token removed" });
    }
  }
});

module.exports = router;
