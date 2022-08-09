var mysql = require('mysql');
var express = require('express');
var app = express()
var http = require('http');
var path = require('path');
const { createHash } = require('crypto');
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const create_schedule = require('./create_schedule');
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
            user_approve:result[0].user_approve,
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
  const student = req.body.student
  console.log(student);
  if(type == '2'){
    var firstname = ''
    var lastname = ''
  }else{
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    console.log(firstname);
  }
  if(type === '3'|| type === '4'|| type === '5'){
    var approve = 0
  }else{
    var approve = 1
  }
  var sql = 'INSERT INTO users (user,user_pass,user_type,email,first_name,last_name,user_approve) VALUES (?,?,?,?,?,?,?)';
  con.query(sql, [user,pass,type,email,firstname,lastname,approve], function (err, result) {
    if (err) throw err;
    var sql = 'SELECT * FROM users WHERE user = ? AND user_pass = ?'
    con.query(sql, [user, pass], function (err, result) {
      if (err) throw err;
      console.log(result);
      if(result[0].user_type === 2){
        var sql = 'UPDATE users SET parent = ? WHERE userID = ? ';
        con.query(sql,[result[0].userID,student], function (err, r) {
          console.log(r);
          if (err) throw err;
        });

      }
      const token = jwt.sign(
        {
          userID: result[0].userID,
          user: result[0].user,
          user_type: result[0].user_type,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          email:result[0].email,
          user_approve:result[0].user_approve,
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
app.post('/all_comp_data', auth, function(req, res) {
  var sql = 'SELECT * FROM competitions';
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
    res.end();
  });
});
app.post('/comp_data', auth, function(req, res) {
  const compID = req.body.compID
  var sql = 'SELECT * FROM competitions WHERE compID = ?';
  con.query(sql,[compID], function (err, result) {
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
  var user = req.user;
  if (user.user_type === 2) {
  var sql = 'SELECT * FROM users WHERE parent = ?';
  con.query(sql,[user.userID], function (err, result) {
    if (err) throw err;
    const spon = {user,result}
    res.send(spon);
    res.end();
  });
  }else{
    res.send({user});
    res.end();
  }
  
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
  const user = req.body.user
  const compID = req.body.compID
  var entries=req.body.entries
  var sql = 'DELETE FROM entries WHERE userID = ? AND compID = ?';
  con.query(sql,[user,compID], function (err, result) {
    console.log(result);
    if (err) throw err;
  });
  if (entries){
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
  }else{
    res.status(201).send({
      message:"entries deleted successfully",
    })
  }
  
});
app.post('/get_existing_names', function(req, res) {
  var sql = 'SELECT userID,first_name,last_name FROM users WHERE user_type = 0';
  con.query(sql, function (err, result) {
    if (err) throw err;    
    res.send(result);
    res.end();    
  });
});
app.post('/check_existing_entry',auth, function(req, res) {
  const user = req.body.user;
  const compID = req.body.compID
  var sql = 'SELECT * FROM entries WHERE userID = ? AND compID = ?';
  con.query(sql,[user,compID], function (err, result) {
    if (err) throw err;
    res.send(result);
    res.end();
  });
});
app.post('/config_rooms',auth, function(req, res) {
  const rooms = JSON.stringify(req.body.rooms)
  const compID = req.body.compID
  var sql = 'UPDATE competitions SET comp_rooms = ? WHERE compID = ? ';
  con.query(sql,[rooms,compID], function (err, r) {
    res.send(r);
    if (err) throw err;
  });
});
app.post('/reset_rooms',auth, function(req, res) {
  const comp = req.body.comp
  var sql = 'UPDATE competitions SET comp_rooms = 0 WHERE compID = ? ';
  con.query(sql,[comp.compID], function (err, r) {
    if (err) throw err;
    res.send(r);
    console.log(r);
  });
});
app.post('/offical_names',auth, function(req, res) {
  var sql = 'SELECT first_name,last_name,userID FROM users WHERE user_type = 4';
  con.query(sql, function (err, steward) {
    if (err) throw err;
    var sql = 'SELECT first_name,last_name,userID FROM users WHERE user_type = 5';
    con.query(sql, function (err, judge) {
      if (err) throw err;
      var multires = {steward,judge}
      res.send(multires);
      res.end();
    });
  });
});
app.post('/create_schedule', function(req, res) {
  const compID = req.body.compID;
  var sql = 'SELECT * FROM entries WHERE compID = ?';
  con.query(sql,[compID], function (err, entries) {
    if (err) throw err;    
    var sql = 'SELECT * FROM competitions WHERE compID = ?';
    con.query(sql,[compID], function (err, comp) {
      if (err) throw err;    
      var comp_data = comp[0]
      const sch_res = create_schedule(comp_data,entries)
      var sql = 'UPDATE competitions SET comp_schedule = ? WHERE compID = ? ';
      con.query(sql,[JSON.stringify(sch_res),compID], function (err, r) {
        if (err) throw err;
      });
      const userID_arr = entries.map((v)=>{return v.userID})
      var sql = 'SELECT * FROM users WHERE userID IN (?)';
      con.query(sql,[userID_arr], function (err, user_data) {
        if (err) throw err;    
        const send_data = {sch_res,comp_data,user_data}
        res.send(send_data);
        res.end();    
         
      });
    
    });  
  });
});
app.post('/comp_users',function(req,res) {
  const compID = req.body.compID
  var sql = 'SELECT * FROM entries WHERE compID = ? ';
  con.query(sql,[compID], function (err, result) {
    if (err) throw err; 
    const user_list = result.map((v) => { return v.userID})
    var sql = 'SELECT * FROM users WHERE userID IN (?)';
    con.query(sql,[user_list], function (err, result) {
      if (err) throw err;    
      res.send(result);
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
