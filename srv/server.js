const express = require("express");
const passport = require("passport");
const xsenv = require("@sap/xsenv");
const JWTStrategy = require("@sap/xssec").JWTStrategy;
const httpClient = require("@sap-cloud-sdk/http-client");
const {retrieveJwt} = require("@sap-cloud-sdk/connectivity");
const services = xsenv.getServices({uaa:"cfdemo2321-xsuaa"}, {dest: {label: 'destination'}}); //XSUAA service & destination
const app = express();
const destination = "sfdemo";
const destinationTECH = "sfodatatech";
const destinationAPI = "sfodataapi";


passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*app.get("/", function (req, res,next){
    res.send("Welcome to basic NodeJS");
});*/

app.get("/", function (req, res,next){
    res.send("Welcome to basic NodeJS: " + req.user.id);
});

app.get("/user", function (req, res,next){
    res.send("I am: " + req.user.id);
});

// /srv/destination?path=cust_CompanyShirts_S0026472321
app.get('/destination', async function(req, res){
    console.log("path for getTable: " + '/odata/v2/' + req.query.path);
    try{
        let res1 = await httpClient.executeHttpRequest(
           {
            destinationName: destinationTECH || '',
            jwt: retrieveJwt(req)
           },
           {
                method:'GET',
                url: '/odata/v2/' + req.query.path
           }
        );
        res.status(200).send(res1.data);
    }
    catch(error){
        res.status(500).send(error.message);
    }
});

app.get('/details', async function(req, res){
    
    console.log("details url: "  + '/odata/v2/' + req.query.path);
    try{
        let res1 = await httpClient.executeHttpRequest(
           {
            destinationName: destinationTECH || '',
            jwt: retrieveJwt(req)
           },
           {
                method:'GET',
                url: '/odata/v2/' + req.query.path
           }
        );
        res.status(200).send(res1.data);
    }
    catch(error){
        res.status(500).send(error.message);
    }
});

app.post('/edit', async function(req, res){
    console.log("path for edit: " + '/odata/v2/' + req.query.path);
    console.log("body for edit: " + JSON.stringify(req.body));
    try{
        let res1 = await httpClient.executeHttpRequest(
           {
            destinationName: destinationAPI || '',
            jwt: retrieveJwt(req)
           },
           {
                method:'POST',
                url: '/odata/v2/' + req.query.path,
                data: req.body  
           }
        );
        res.status(200).json(res1.data);
    }
    catch(error){
        res.status(500).send(error.message);
    }
});

app.post('/create', async function(req, res){
    try{
        let res1 = await httpClient.executeHttpRequest(
           {
            destinationName: destinationAPI || '',
            jwt: retrieveJwt(req)
           },
           {
                method:'POST',
                url: '/odata/v2/' + req.query.path,
                data: req.body  
           }
        );
        res.status(200).json(res1.data);
    }
    catch(error){
        res.status(500).send(error.message);
    }
});

app.delete('/delete', async function (req, res){
    try{
        let res1 = await httpClient.executeHttpRequest(
            {
                destinationName: destinationAPI || '',
                jwt: retrieveJwt(req)
            },
            {
                method: 'DELETE',
                url: '/odata/v2/' + req.query.path
            }
            
        );
        res.status(200).send();
    } catch (err){
        res.status(500).send(err.message);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Basic NodeJS listening on port " + port);
});