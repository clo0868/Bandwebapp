var mysql = require('mysql');
var express = require('express');
var app = express()
var http = require('http');
var path = require('path');
const { createHash } = require('crypto');
const jwt = require("jsonwebtoken");
const auth = require("./auth");
function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}
console.log("i am listening");
var server = http.createServer(app)
server.listen(process.env.PORT || 3001)
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pipe_band_app"
});
con.connect(function(err) {
	if (err) throw err
});
app.set("view engine", "ejs");
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
  // Listen to POST requests to /users.
app.post('/login', function(req, res) {
  // Get sent data.
  //console.log(req);
  var user = req.body.user;
  var pass = hash(req.body.pass);
  // Do a MySQL query.
  var sql = 'SELECT * FROM users WHERE user = ? AND user_pass = ?';
  con.query(sql, [user,pass], function (err, result) {
    if (err) throw err;
    if (result.length == 0) {
      res.status(500).send({
        message: "user not found"
      })
    }else{
      const token = jwt.sign(
        {
          userID: result[0].userID,
          user: result[0].user,
          user_type: result[0].user_type,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h" }
      );
      res.status(201).send({
        message:"user logged in successfully",
        result: result,
        token
      })
    }
    res.end();
  });
});
app.post('/signup', function(req, res) {
  // Get sent data.
  var user = req.body.user;
  var pass = hash(req.body.pass);
  // Do a MySQL query.
  var sql = 'SELECT * FROM users WHERE user = ?'
  con.query(sql, [user], function (err, result) {
    if (err) throw err;
    if(result.length === 0){
      var sql = 'INSERT INTO users (user,user_pass,user_type) VALUES (?,?,0)';
      con.query(sql, [user, pass], function (err, result) {
        if (err) throw err;
        var sql = 'SELECT * FROM users WHERE user = ? AND user_pass = ?'
        con.query(sql, [user, pass], function (err, result) {
          if (err) throw err;
          const token = jwt.sign(
            {
              userID: result[0].userID,
              user: result[0].user,
              user_type: result[0].user_type,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
          res.status(201).send({
            message:"user created successfully",
            result: result,
            token
          })
          res.end();
        });
      })
    }else{
      res.status(500).send({message:"username already taken"});
      res.end();
    }

  });
  
});
app.post('/comp_data', auth, function(req, res) {
  var sql = 'SELECT * FROM competitions';
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    res.end();
  });
});
app.post('/user',auth, function(req, res) {
  console.log(req.user);
  res.send(req.user);
  res.end();
});
app.post('/event_grade_name',auth, function(req, res) {
  var sql = 'SELECT grade_name FROM grades';
  con.query(sql, function (err, grades) {
    if (err) throw err;
    var sql = 'SELECT event_name FROM events';
    con.query(sql, function (err, events) {
      if (err) throw err;
      var multires = {grades,events}
      res.send(multires);
      res.end();
    });
  });
});
app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'C:\\xampp\\htdocs\\Bandwebapp\\public\\index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});
