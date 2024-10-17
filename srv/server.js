const express = require("express");
const passport = require("passport");
const xsenv = require("@sap/xsenv");
const JWTStrategy = require("@sap/xssec").JWTStrategy;
const services = xsenv.getServices({ uaa:"cfdemoS0026472321-xsuaa" }); //XSUAA service

const app = express();

passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false}));

/*app.get("/", function (req, res,next){
    res.send("Welcome to basic NodeJS");
});*/

app.get("/", function (req, res,next){
    res.send("Welcome to basic NodeJS: " + req.user.id);
});

const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Basic NodeJS listening on port " + port);
});