var express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var router = express.Router();


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

//Get db model
var User = require('../models/user');
var Chat = require('../models/chat');

//DB TESTER PAGE
router.get('/data', function(req, res, next) {

    //Find object with name Bruce Wayne
    User.find({}, function(err, batman) {
        if (err) return console.error(err);
        console.dir("Retrived file from db.");
        res.render('index.html', {group: batman});
    });
});

/* Test from html file input to server to database */
router.post('/usernameTest', function(req, res, next){
  console.dir(req.body.uname);
  console.dir(req.body.pword);
  User.findOne({username: req.body.uname}, function(err, user) {

    if (!user) {//Username not taken
      var input_user = new User({username: req.body.uname, password: req.body.pword});

      input_user.save(function(err, funct) {
        if(!err){
            console.dir("New User Saved.");
        } else {
            console.dir("Failed to save user: ");
            console.dir(err);
        }

      });
    }
      res.redirect('/data');
  });
});

/* Test from html file input to server to database */
router.post('/cleardb', function(req, res, next){
  User.remove({}, function(err) {
    console.log('collection removed')
    res.redirect('/data');
  });
});

/* Login Authentication */
router.post('/LoginAuthentication', function(req, res, next){
  var log_username = req.body.username;
  var log_password = req.body.password;

  console.dir(log_username);
  console.dir(log_password);

  //Find user in user database
  User.findOne({username: log_username}, function(err, user) {
    //Password matches and go through
    if ((user) && (user.password == log_password)) {
      console.dir("User found and password matches.");
      res.redirect('/homepage');
    }

  });

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage_inital.html', {});
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
    res.render('signup.html', {});
});

/* GET edit profile page. */
router.get('/editProfile', function(req, res, next) {
    res.render('editprofile.html', {});
});

/* GET fb login page. */
router.get('/facebookLog', function(req, res, next) {
    res.render('facebookLog.html', {});
});

/* GET user homepage page. */
router.get('/homepage', function(req, res, next) {
    res.render('homepage_user.html', {});
});

/* GET inbox page. */
router.get('/inbox', function(req, res, next) {
    res.render('inbox.html', {});
});


/* GET links page. */
router.get('/links', function(req, res, next) {
    res.render('links.html', {});
});

/* GET message page. */
router.get('/message', function(req, res, next) {
    res.render('message.html', {});
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {
    res.render('profile.html', {});
});

/* GET review page. */
router.get('/review', function(req, res, next) {
    res.render('review.html', {});
});

/* GET search page. */
router.get('/search', function(req, res, next) {
    res.render('search.html', {});
});

/* GET weekview page. */
router.get('/weekView', function(req, res, next) {
    res.render('weekview.html', {});
});

/* GET weekview page. */
router.get('/registration', function(req, res, next) {
    console.log("I just received the following data: ");
    res.render('weekview.html', {});
    //console.log(req.query.data);
});

function checkNewUserData(data)
{
    var toTest = [];
    toTest.push(data["username"]);
    toTest.push(data["password"]);
    for (var i = 0; i < toTest.length; i++)
    {
        if(toTest[i])
        {
            if(toTest[i] == "")
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    return true;
}

io.on('connection', function(client){
  console.log('a user connected');

  client.on('register', function(data) {
        data = JSON.parse(data);
        console.log("THE DATA IS EQUAL TO: ");
        console.log(data);

        if(!checkNewUserData(data))
        {
            console.log("Invalid user data");
            return;
        }

        User.findOne({username: data["username"]}, function(err, user) {

          if (!user)
          {//Username not taken
            var tutorB = data["type_of_user"] == "Yes" ? true : false;
            var adminB = false;
            var freeTimesJSON = JSON.stringify(data["events"]);
            var input_user = new User({name: data["name"], email: data["email"], username: data["username"], password: data["password"], tutor: tutorB, admin: adminB, subjects: data["subjects"], freeTimes: freeTimesJSON});
            console.log("This is the input_user:");
            console.log(input_user);
            input_user.save(function(err, funct) {
                if(!err){
                    console.dir("New User Saved.");
                } else {
                    console.dir("Failed to save user: ");
                    console.dir(err);
                }
            });
          }
        });
    });

  client.on('subscribe', function(room){
        console.log('Logging into room ', room);
        client.join(room);
        //TODO:load all messages from db
  });

  client.on('message', function(data){
        console.log(data);
        io.sockets.in(data.room).emit('message', data.msg);
        //TODO: Save msg to db
  });


});

http.listen(4200, function(){
  console.log('listening SOCKET on *:4200');
});

module.exports = router;
