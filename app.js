var   express           = require("express"),
      mysql             = require("mysql"),
      passport          = require("passport"),
      bodyParser        = require("body-parser"),
      LocalStrategy     = require("passport-local").Strategy,
      FacebookStrategy  = require('passport-facebook').Strategy,
      GoogleStrategy    = require('passport-google').Strategy,
      flash             = require('connect-flash'),
      crypto            = require('crypto'),
      user              = require("./models/user"),
      morgan            = require('morgan');


const methodOverride  = require('method-override'),
      cookieParser    = require('cookie-parser'),
      ejs             = require('ejs'),
      session         = require('express-session');


//=========================
//connecting with mysql DB
//=========================
var con = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: 'swastik0310',
  database: 'meraki'
});
con.connect(function(err){
    if(err){
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + con.threadId);
});






// set view engine
var app = express();
app.set('view engine','ejs');


//setup body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(morgan('dev'));

//set-up method-override
app.use(methodOverride('_method'));

app.use(flash({locals:'flash'}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use(express.static("public"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({
    key: 'user_name',
    secret: 'apna dbms project',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
  }));

function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.sendStatus(401);
    }
};
// app.use(session({
//     secret: 'apna dbms project',
//     resave: false,
//     saveUninitialized: false
// }));
//============








//===============
// FACEBOOK AUTH
//===============
// passport.use(new FacebookStrategy({
//     clientID: your_facebook_clientID,
//     clientSecret: "your_facebook_secret",
//     callbackURL: "http://www.example.com/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     user.findOrCreate(function(err, user) {
//       if (err) { return done(err); }
//       done(null, user);
//     });
//   }
// ));
// app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/facebook',
//   passport.authenticate('facebook', { scope: 'read_stream' })
// );
// app.get('/auth/facebook/callback',
// passport.authenticate('facebook', { successRedirect: '/',
//                                     failureRedirect: '/login' }));
//===================
// FACEBOOK AUTH END
//===================






//=============
//GOOGLE AUTH
//=============
passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, done) {
    user.findByOpenID({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
  ));
  app.get('/auth/google',
    passport.authenticate('google'),
    function(req, res){
      // The request will be redirected to Google for authentication, so this function will not be called.
    });

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/dashboard');
    });
  //=================
  //GOOGLE AUTH ENDS
  //=================








//===============
//ROUTES...
//===============

//===home route===
app.get("/",function(req,res){
    res.render("index");
});

app.get("/about-us",function(req,res){
  res.render("about-us");
});


app.get("/contact-us",function(req,res){
  res.render("contact-us");
});

app.post("/contact-us",function(req,res){
  console.log(req.body)
  insertQuery = "INSERT INTO contactus (firstName, lastName, email, subject, message) VALUES ('" + req.body.firstName + "', '" + req.body.lastName + "', '" + req.body.email + "', '" + req.body.subject + "', '" + req.body.message + "')";
  console.log(insertQuery)
  con.query(insertQuery, (err, result, field)=>{
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  })
  
});

app.get("/catalogue", function (req, res){
  res.render("catalogue");
});


app.get("/category/:id", (req,res)=>{
  query = "select * from courses where tag = '" + req.params.id + "'";
  con.query(query, (err, result, fields)=>{
    console.log(result)
    res.render("courses", {result: result})
  })
})

app.get("/course/upvote/:id", (req, res)=>{
  var id = req.params.id;
  console.log(id);
  // id = parseInt(id);
  console.log(typeof id);
  querySelect = "SELECT upvote FROM courses WHERE courseId = " + id;
  
  con.query(querySelect, (err, result, fields)=>{
    if (err){
      console.log(err);
    } else{
      console.log(result)
      var upvote = result[0].upvote + 1;
      console.log(upvote)
      queryUpdate = "UPDATE courses SET upvote = " + upvote + " WHERE courseId = " + id;
      console.log(queryUpdate)
      con.query(queryUpdate, (err2, result2, fields2)=>{
        if (err){
          console.log(err2);
        } else{
          console.log(result2)
          var obj = {upvote: upvote}
          var api = JSON.stringify(obj);
          res.send(api)
        }
      })
    }
  })
})


app.get("/course/downvote/:id", (req, res)=>{
  var id = req.params.id;
  console.log(id);
  // id = parseInt(id);
  console.log(typeof id);
  querySelect = "SELECT downvote FROM courses WHERE courseId = " + id;
  
  con.query(querySelect, (err, result, fields)=>{
    if (err){
      console.log(err);
    } else{
      console.log(result)
      var downvote = result[0].downvote + 1;
      console.log(downvote)
      queryUpdate = "UPDATE courses SET downvote = " + downvote + " WHERE courseId = " + id;
      console.log(queryUpdate)
      con.query(queryUpdate, (err2, result2, fields2)=>{
        if (err){
          console.log(err2);
        } else{
          console.log(result2)
          var obj = {downvote: downvote}
          var api = JSON.stringify(obj);
          res.send(api)
        }
      })
    }
  })
})


app.get("/search", function (req, res){
  var query = "select * from courses where title = '" + req.query.course + "'";
  con.query(query, (err, result, field)=>{
    if (err){
      console.log(err);
    }else{
      res.render("courses", {result: result})    }
  }) 
  // res.send("here we will show search results");
});



//===signup routes===
app.get("/signup",function(req,res){
    if(!(req.session && req.session.user)){
      res.render("signup");
    }
    else
    res.redirect("/");
});
app.post("/signup", function(req,res){
  var today = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(today);
  var user_name      = req.body.username;
  var user_email     = req.body.email;
  var user_password  = req.body.password;
  var full_name      = req.body.fullname;
  var interests      = req.body.interests;
  var created        = today;
  var modified       = today;
  var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
  salt = salt+''+user_password;
  var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
  con.query("SELECT * FROM userRegistration WHERE user_name = ?",[user_name], function (error, rows) {
    if(error){
      console.log(error);
      res.redirect("/signup");
    }
    if(rows.length){
      console.log("username already used...please try another one");
      res.redirect("/signup");
    }
    else{
      var query1 = "INSERT INTO userRegistration (user_name, user_email, user_password,full_name, interests,created,modified) VALUES ('" + user_name + "'" + ", '" + user_email +"'"+ ", '" + encPassword +"'"+ ", '" + full_name +"'"+ ", '" + interests +"'"+ ", '" + created +"'"+ ", '" + modified +"'"+ ")";
      con.query(query1, function (error, results, fields) {
        if (error) throw error;
        else{
          console.log("user successfully registered");
          res.redirect ("/");
        }
  });
    }
  });
});




//===login routes===
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login", function(req,res){
    var user_name      = req.body.username;
    var user_password  = req.body.password;
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    salt = salt+''+user_password;
    var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
    con.query("SELECT * FROM userRegistration WHERE user_name = ?",[user_name], function (error, rows) {
        if (error) {
          console.log("Invalid username");
          res.redirect("/login");
        }
        else{
          var dbPassword  = rows[0].user_password;
            if(!(encPassword==dbPassword)){
              console.log("Incorrect Password");
              res.redirect("/login");
            }
            else{
              console.log("Logged in");
              req.session.user = user_name;
              req.session.admin = true;
              res.redirect("/dashboard");
            }
        }
    });
  });





//===logout routes===
app.get('/logout',function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});







//===course routes===
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

app.get("/topic/:id", (req, res)=>{
  var topic = req.params.id;
  query ="select * from courses where tag = '" + topic + "'";
  con.query(query, (err, result, fields)=>{
    if(err){
      console.log("err");
    }else{
      console.log(result);
      res.send(result);
    }
  })
})



// ==============================================================================
//===dashboard routes===
// ==============================================================================
app.get("/dashboard/",function(req,res){
  //   if(!(req.session && req.session.user)){
  //     res.redirect("/login");
  //   }
  //   else{
      console.log(req.session);
      var userName = req.session.user
      var query = "select * from userRegistration where user_name = 'random'";
      con.query(query, function (error, results, fields){
          if (error) throw error;
          else{
              var user_name = results[0].user_name;
              var user_email = results[0].user_email;
              var full_name = results[0].full_name;
              var queryInt = "select * from userCourses where user_name = 'random' AND course_type = 'interested'"
              var querypursue = "select * from userCourses where user_name = 'random' AND course_type = 'pursue'"
              var querycompleted = "select * from userCourses where user_name = 'random' AND course_type = 'completed'";
              var interestedCourses = [];
              var pursuingCourses = [];
              var completedCourses = [];
              con.query(queryInt, function (errorInt, resultsInt,fieldsInt){
                  if (errorInt) throw errorInt;
                  else{
                      console.log(resultsInt);
                      resultsInt.forEach(function(interests){
                          console.log(interests.course_name);
                          interestedCourses.push(interests.course_name);
                      });
  
                          con.query(querypursue, function (errorpursue, resultspursue,fieldspursue){
                              if (errorpursue) throw errorpursue;
                              else{
                                  console.log(resultspursue);
                                  resultspursue.forEach(function(pur){
                                      console.log(pur.course_name);
                                      pursuingCourses.push(pur.course_name);
                                  })
                                  con.query(querycompleted, function (errorcomp, resultscomp,fieldscomp){
                                      if (errorcomp) throw errorcomp;
                                      else{
                                          console.log(resultscomp);
                                          resultscomp.forEach(function(comp){
                                              console.log(comp.course_name);
                                              completedCourses.push(comp.course_name);
                                          })
                                          res.render("dashboard-index", {user_name: user_name, user_email: user_email, full_name: full_name, interestedCourses: interestedCourses, pursuingCourses: pursuingCourses, completedCourses: completedCourses});
                                      }
                                  })
                              }
                          })
                  }
              })
              
          }
      })
  });
  
app.get("/dashboard/recommended-courses", (req,res)=>{
  var query = "select topic from userRegistration where user_name = 'random'";
  con.query(query, (err, result, fields)=>{
    if(err){
      console.log(err);
    }else{
      var topic = result[0].topic;
      console.log(topic)
      var findQuery = "select * from courses where tag = '" + topic + "' order by upvote DESC limit 10";
      console.log(findQuery)
      con.query(findQuery, (err2, result2, field2)=>{
        if(err){
          console.log(err)
        }else{
          console.log(result2)
          res.render("dashboard-recommended-courses", {result2: result2})
        }
        
      })
    }
  })
})


  app.get('/user/profile', (req,res)=>{
      query = "select * from userRegistration where user_name = 'random'";
      con.query(query, (err, result, field)=>{
          if (err){
              console.log(err)
          }else{
              console.log(result);
              res.render('profile', {user: result[0]});
          }
      })
      
  });
  
  app.post('/user/profile/add-IT', (req, res)=>{
      console.log(req.body.IT);
      console.log(req.session.user)
      var IT = req.body.IT;
      var user = req.session.user;
      query = 'INSERT INTO userCourses (user_name, topic)';
      res.redirect('/user/profile')
  })
  
  app.post('/user/profile/add-IC', (req, res)=>{
      console.log(req.body.IC);
      console.log(req.session.user)
      var IC = req.body.IC;
      var user = req.session.user;
      query = "INSERT INTO userCourses (user_name, course_type, course_name) values (" +"'" + user + "', 'interested', " + "'" + IC + "')";
      // con.query(query, (err, result)=>)
      res.redirect('/user/profile')
  })



//==============
//ROUTES END
//==============


app.listen(3000,process.env.IP,function(){
    console.log("server started.... ");
});
