var express = require("express");
var url = require("url");
var bodyParser = require("body-parser");
var randomstring = require("randomstring");
var cons = require("consolidate");
var nosql = require("nosql").load("database.nosql");
var qs = require("qs");
var querystring = require("querystring");
var request = require("sync-request");
var __ = require("underscore");
var base64url = require("base64url");
var jose = require("jsrsasign");
var cors = require("cors");

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // support form-encoded bodies (for bearer tokens)

app.engine("html", cons.underscore);
app.set("view engine", "html");
app.set("views", "files/protectedResource");
app.set("json spaces", 4);

app.use("/", express.static("files/protectedResource"));
app.use(cors());

var resource = {
  name: "Protected Resource",
  description: "This data has been protected by OAuth 2.0",
};

var rsaKey = {
  alg: "RS256",
  e: "AQAB",
  n: "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
  kty: "RSA",
  kid: "authserver",
};

var getAccessToken = function (req, res, next) {
  next();
};

var requireAccessToken = function (req, res, next) {
  if (req.access_token) {
    next();
  } else {
    res.status(401).end();
  }
};

app.options("/resource", cors());

app.post("/resource", cors(), getAccessToken, function (req, res) {
  res.end();
});

var userInfoEndpoint = function (req, res) {
  res.end();
};

app.get("/userinfo", getAccessToken, requireAccessToken, userInfoEndpoint);
app.post("/userinfo", getAccessToken, requireAccessToken, userInfoEndpoint);

var server = app.listen(9002, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("OAuth Resource Server is listening at http://%s:%s", host, port);
});
