const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
var cors = require("cors");
app.use(cors());
require("dotenv").config();

const dbRoute = process.env.MONGODB_STRING;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(dbRoute, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB has been connected on port " + PORT))
  .catch((err) => console.log(err));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
require("./auth/auth");

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin, profilerefid(whatever header you need)"
  );
  next();
});

const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");

//Middleware that will verify the jwt token
async function authenitcate(req, res, next) {
  const { accesstoken } = req.headers;
  // verify accessToken exists
  if (!accesstoken) {
    const error = new Error("Missing Access Token");
    res.status(404);
    return next(error);
  }

  // verify accessToken
  jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // if invalid, throw 498
      const error = new Error("Invalid Token");
      res.status(498);
      return next(error);
    } else {
      next();
    }
  });
}

app.use("/", routes);
app.use("/user", authenitcate, secureRoute);

//Catchall handle errors
app.use(function (error, req, res, next) {
  res.send({ error: error.message });
  res.on("finish", () => {
    console.log(res.statusCode, error.message);
  });
});

//Server static assets if in production
// Accessing the path module

// Step 1:
app.use(express.static(path.resolve(__dirname, "../client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server started on : ", PORT);
});
