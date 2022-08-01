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
  var sql = 'SELECT * FROM users WHERE user = ?';
  con.query(sql, [user], function (err, result) {
    if (err) throw err;
    if (result.length == 0) {
      res.status(500).send({
        message: "Incorrect username"
      })
    }else{
      if (result[0].user_pass == pass){
        const token = jwt.sign(
          {
            userID: result[0].userID,
            user: result[0].user,
            user_type: result[0].user_type,
            first_name: result[0].first_name,
            last_name: result[0].last_name,
            email:result[0].email,
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" }
        );
        res.status(201).send({
          message:"user logged in successfully",
          result: result,
          token
        })
      }else{
        res.status(500).send({
          message: "Incorrect password"
        })
      }
    }    
  });
});
app.post('/signup', function(req, res) {
  // Get sent data.
  const user = req.body.username;
  const pass = hash(req.body.pass);
  const type = req.body.type;
  const email = req.body.email;
  if(type == '2'){
    const student = req.body.student
    console.log(student);
    var firstname = student.first_name
    var lastname = student.last_name
  }else{
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    console.log(firstname);
  }
  var sql = 'INSERT INTO users (user,user_pass,user_type,email,first_name,last_name) VALUES (?,?,?,?,?,?)';
  con.query(sql, [user,pass,type,email,firstname,lastname], function (err, result) {
    if (err) throw err;
    var sql = 'SELECT * FROM users WHERE user = ? AND user_pass = ?'
    con.query(sql, [user, pass], function (err, result) {
      if (err) throw err;
      const token = jwt.sign(
        {
          userID: result[0].userID,
          user: result[0].user,
          user_type: result[0].user_type,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          email:result[0].email,
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
});
app.post('/comp_data', auth, function(req, res) {
  var sql = 'SELECT * FROM competitions';
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    res.end();
  });
});
app.post('/check_existing_user', function(req, res) {
  var user = req.body.user;
  var sql = 'SELECT * FROM users WHERE user = ?';
  con.query(sql,[user], function (err, result) {
    if (err) throw err;
    res.send(result);
    res.end();
  });
});
app.post('/user',auth, function(req, res) {
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
app.post('/create_comp',auth, function(req, res) {
  data=req.body.form_data
  console.log(data[5][0]);
  var sql = 'INSERT INTO competitions (`comp_name`, `comp_location`, `comp_start_time`,`ent_open_time`,`ent_close_time`,`comp_events`,`comp_rooms`,`comp_schedule`) VALUES (?,?,?,?,?,?,?,?)';
  con.query(sql,[data[0],data[2],data[1],data[3],data[4],JSON.stringify(data[5]),0,0], function (err, grades) {
    if (err) throw err;
  });
});
app.post('/comp_entries',auth, function(req, res) {
  var comp_data = req.body.comp;
  var sql = 'SELECT * FROM entries INNER JOIN users ON entries.userID = users.userID WHERE entries.compID = ?';
  con.query(sql,[comp_data.compID], function (err, result) {
    if (err) throw err;
    res.send(result);
    res.end();
  });
});
app.post('/create_entries',auth, function(req, res) {
  var entry_input = []
  const user = req.user.userID
  const compID = req.body.compID
  var entries=req.body.entries
  var sql = 'DELETE FROM entries WHERE userID = ? AND compID = ?';
  con.query(sql,[user,compID], function (err, result) {
    if (err) throw err;
    });
  var comp_events=req.body.comp_events
  var entry_indicies = [...entries.keys()].filter(i => entries[i])
  for (let i = 0; i < entry_indicies.length; i++) {
    entry_input.push(comp_events[entry_indicies[i]])
    var sql = 'INSERT INTO `entries`(`userID`, `compID`, `gradeID`, `eventID`, `placing`) VALUES (?,?,?,?,0)';
    con.query(sql,[user,compID,comp_events[entry_indicies[i]].grade,comp_events[entry_indicies[i]].event], function (err, result) {
      if (err) throw err;
      if(i===entry_indicies.length-1){
        res.status(201).send({
          message:"entered successfully",
          result: result,
        })
      }
    });
  }
});
app.post('/get_existing_names', function(req, res) {
  var sql = 'SELECT first_name,last_name FROM users';
  con.query(sql, function (err, result) {
    if (err) throw err;    
    res.send(result);
    res.end();    
  });
});
app.post('/check_existing_entry',auth, function(req, res) {
  const user = req.user;
  const compID = req.body.compID
  var sql = 'SELECT * FROM entries WHERE userID = ? AND compID = ?';
  con.query(sql,[user.userID,compID], function (err, result) {
    if (err) throw err;
    res.send(result);
    res.end();
  });
});
app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'C:\\xampp\\htdocs\\Bandwebapp\\public\\index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});
