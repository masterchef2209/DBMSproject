var express                        = require("express");
var app                            = express();
var bodyParser                     = require("body-parser");
const methodOverride               = require('method-override');
var passport                       = require('passport');
const GoogleStrategy               = require('passport-google-oauth20').Strategy;
const session                      = require('express-session');
const cookieParser                 = require('cookie-parser');


// set view engine
app.set('view engine', 'ejs');


app.use(session({ 
    secret: 'apna dbms project',
    resave: false,
    saveUninitialized: false
}));


//set-up method-override
app.use(methodOverride('_method'));


//setup body-parser
app.use(bodyParser.urlencoded({extended : true}));


app.use(express.static("public"));


app.use(cookieParser());


// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res){
    res.send("index page");
});


app.get("/login", function (req, res){
    res.send("login page");
});


app.get("/search", function (req, res){
    res.send("here we will show search results");
});


app.get("/categories", function (req, res){
    res.send("here we will show all possible categories");
});

app.listen(3000,function(){
    console.log("Server is Up..!!"); 
});