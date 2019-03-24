var mysql = require("mysql");
var passportLocal = require("passport-local");


exports.signup = function(req,res){
    // console.log("req",req.body);
   
    var today = new Date();
    var userRegistration={
      "user_name":req.body.username,
      "user_password":req.body.password,
      "user_email":NULL,
      "full_name":NULL,
      "created":today,
      "modified":today
    }
    userRegistration.plugin(passportLocal);
    // module.exports= mysql.model("user",exports.signup);
    connection.query('INSERT INTO user SET ?',userRegistration, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log('The solution is: ', results);
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
    }
    });
  }
