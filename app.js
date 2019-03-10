var express                        = require("express");
var app                            = express();
var bodyParser                     = require("body-parser");
const methodOverride               = require('method-override');
var passport                       = require('passport');
const GoogleStrategy               = require('passport-google-oauth20').Strategy;
const session                      = require('express-session');
const cookieParser                 = require('cookie-parser');
const mysql                        = require('mysql');


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '<YOUR PASSWORD>',
    database : 'meraki'
  });
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

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

app.get("/add-new-course", (req,res)=>{
    res.render("add-new-course");
})

app.post("/add-new-course", (req,res)=>{
    var title      = req.body.title;
    var tag        = req.body.tag[0];
    var link       = req.body.link;
    var instructor = req.body.instructor;
    var price      = req.body.price;
    var query = "INSERT INTO courses (title, tag, link, instructor, price) VALUES ('" + title + "'" + ", '" + tag +"'"+ ", '" + link +"'"+ ", '" + instructor +"'"+ ", '" + price +"'"+ ")";
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        else{
            res.redirect ("/add-new-course")
        }
    });
    
    
})

// example of query action
// connection.query('SELECT * FROM `books` WHERE `author` = "David"', function (error, results, fields) {
//     // error will be an Error if one occurred during the query
//     // results will contain the results of the query
//     // fields will contain information about the returned results fields (if any)
//   });

app.get("/search", function (req, res){
    res.send("here we will show search results");
});


app.get("/categories", function (req, res){
    res.send("here we will show all possible categories");
});

app.listen(3000,function(){
    console.log("Server is Up..!!"); 
});