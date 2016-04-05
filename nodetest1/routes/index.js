var express = require('express');
var cookieParser = require('cookie-parser');
var cookieSign = require('cookie-signature');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var router = express.Router();


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

//Get db model
var User = require('../models/user');
var Chat = require('../models/chat');
var Review = require('../models/reviews');

//DB TESTER PAGE
router.get('/data', function(req, res, next) {

    User.find({}, function(err, batman) {
        if (err) return console.error(err);
        console.dir("Retrived file from db.");
        res.render('index.html', {group: batman});
    });
});

//COOKIE TESTER PAGE
router.get('/cookiesignread', function(req, res, next) {
    console.dir(cookieSign.unsign(req.cookies.testingSign, 'tobiiscool'));
    res.redirect('/');
});
//COOKIE TESTER PAGE
router.get('/cookiesign', function(req, res, next) {
    var val = cookieSign.sign('hello', 'tobiiscool');
    res.clearCookie('testingSign');
    res.cookie('testingSign' , val, {expire : new Date() + 9999}).send('Cookie is set');
});


//COOKIE TESTER PAGE
router.get('/cookie', function(req, res, next) {
    res.clearCookie('tutorMeData');
    res.clearCookie('MyCookie');
    res.cookie('MyCookie' , 'cookie_value123', {expire : new Date() + 9999}).send('Cookie is set');
});

/* Test from html file input to server to database */
router.post('/usernameTest', function(req, res, next){
  console.dir(req.body.uname);
  console.dir(req.body.pword);
  User.findOne({username: req.body.uname}, function(err, user) {
  console.dir("Inside find.");
    if (!user) {//Username not taken
      var input_user = new User({name: req.body.realname, username: req.body.uname, password: req.body.pword});

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
    if (user == null){ //user not found
      console.dir('user not found')
      res.redirect('/');
    } else {
      //Password matches and go through
      if (user.password == log_password) {
        console.dir("User found and password matches.");
        //SAVE THE COOKIE
        //var userData = {username: user.username};
        //res.cookie('tutorMeData' , JSON.stringify(userData), {expire : new Date() + 9999});
        var secret = 'tutorMeSecretString';
        var val = cookieSign.sign(user.username, secret);
        res.clearCookie('tutorMeData');
        res.cookie('tutorMeData' , val, {expire : new Date() + 9999});

        res.redirect('/homepage');
      } else {
        res.redirect('/');
      }
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
    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.render('homepage_inital.html', {});
    }
    var result = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(result)
    {
        res.render('homepage_user.html', {});
    }
    else
    {
        res.render('homepage_inital.html', {});
    }
});

/* GET inbox page. */
router.get('/inbox', function(req, res, next) {
    res.redirect('/message');
});


/* GET links page. */
router.get('/links', function(req, res, next) {
    res.render('links.html', {});
});

/* GET message page. */
router.get('/message', function(req, res, next) {
    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.render('homepage_inital.html', {});
    }
    var result = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(result)
    {
        User.find({username: result}, function(err, user) {
            if (err) return console.error(err);
            if(user[0])
            {
                var user = user[0];
                var chats = user.chats;
                var allTalks = {};
                var listOfTalks = [];
                for(var i = 0; i < chats.length; i++)
                {
                    var found = 0;
                    var userTalkingTo = chats[i].user;
                    Chat.find({roomName: chats[i].room}, function(err, chatFound) {
                        found++;
                        if(chatFound[0])
                        {
                            var lastMsg = chatFound[0].messages[chatFound[0].messages.length - 1].msg;
                            var read = 0; //TODO: Change this to actual read or not read values - FUTURE IMPLEMENTATION
                            var talk = {name: userTalkingTo, message: lastMsg, read: read};
                            listOfTalks.push(talk);
                        }
                        if(found == chats.length)
                        {
                            allTalks.results = listOfTalks;
                            res.render('inbox.html', {userNameReceived: result, allTalks: JSON.stringify(allTalks)});
                        }
                    });
                }
            }
            else
            {
                res.writeHead(404, {"Content-Type": "text/html"});
                res.write("not found");
                res.end();
            }
        });
    }
    else
    {
        res.render('homepage_inital.html', {});
    }
});

/*Get message page from the logged user*/
router.get('/message&username=*', function(req, res, next) {

    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.render('homepage_inital.html', {});
    }
    var uname_logged = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(uname_logged)
    {
        if(req.url.length <= 18)
        {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write("not found");
            res.end();
        }
        else
        {
            var uname = req.url.substring(18);
            User.find({username: uname}, function(err, user) {
                if (err) return console.error(err);
                if(user[0])
                {
                    res.render('message.html', {logged: uname_logged, receiver: uname});
                }
                else
                {
                    res.writeHead(404, {"Content-Type": "text/html"});
                    res.write("not found");
                    res.end();
                }
            });
        }
    }
    else
    {
        res.redirect('/');
    }

});

/* POST store review data. */
router.post('/addReview', function(req, res, next){
  console.dir(req.body.tutName);
  console.dir(req.body.comment);

  var comment = new Review({reviewee: 'tester', name: req.body.realname, username: req.body.uname, password: req.body.pword});

  comment.save(function(err, funct) {
    if(!err){
      console.dir("New comment.");
      res.redirect("/profile&username=" + req.body.tutName);
    } else {
        console.dir("Failed to save comment ");
        console.dir(err);
    }
  });
});

/* GET review page. */
router.get('/review', function(req, res, next) {
    res.render('review.html', {});
});

/* POST search page - find user. */
var searchedTerm = null;
var searchResults = null;

/* Search Results - search usernames */
router.post('/searchFind', function(req, res, next){
  searchedTerm = req.body.search;
  console.dir(searchedTerm);

  //Find user based on username - should result in one user
  User.findOne({username: searchedTerm}, function(err, user) {
    if (user == null){ //username not found
      console.dir("User not found - searching names");

        //Find the real name of the user
        User.find ({name: searchedTerm}, function(err, users) {
          if (users.length == 0) {
            console.dir("Users not found");
            res.redirect('/data');
          } else {
            console.dir("Users found");
            console.dir(users);
            searchResults = users;
            res.redirect("/search");
          }
        });

    } else {
        console.dir("User found");
        searchResults = user;
        res.redirect("/profile&username=" + searchedTerm);
    }
  });
})

/* GET search page. */
router.get('/search', function(req, res, next) {
  /* Filter multiple user results */
  if (searchResults != null){
    var foundNames = [];
    var foundUsernames = [];

    for (i in searchResults) {
      console.dir(searchResults[i].name);
      foundNames.push(searchResults[i].name);
      foundUsernames.push(searchResults[i].username);
    }
  }
    res.render('search.html', {search: searchedTerm, name: foundNames, username: foundUsernames});
});

/* GET weekview page. */
router.get('/weekView', function(req, res, next) {
    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.redirect('/');
    }
    var result = cookieSign.unsign(req.cookies.tutorMeData, secret);
    console.dir(result);
    if(result)
    {
        res.redirect('/weekView&username=' + result);
    }
    else
    {
        res.redirect('/');
    }
});
router.get('/weekView&username=*', function(req, res, next) {

    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.redirect('/');
    }
    var uname_logged = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(uname_logged)
    {
        if(req.url.length <= 19)
        {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write("not found");
            res.end();
        }
        else
        {
            var uname = req.url.substring(19);
            User.find({username: uname}, function(err, user) {
                if (err) return console.error(err);
                if(user[0])
                {
                    var user_events = user[0].events;
                    res.render('weekview.html', {events: JSON.stringify(user_events), uname: uname, uname_logged: uname_logged});
                }
                else
                {
                    res.writeHead(404, {"Content-Type": "text/html"});
                    res.write("not found");
                    res.end();
                }
            });
        }
    }
    else
    {
        res.redirect('/');
    }

});

/* GET weekview page. */
router.get('/registration', function(req, res, next) {
    console.log("I just received the following data: ");
    res.render('weekview.html', {});
    //console.log(req.query.data);
});

/* GET profile page. */
router.get('/profile&username=*', function(req, res, next) {
    res.render('profile.html', {});
});

// Getting json object by username
router.get('/username=*', function(req, res, next) {
    if(req.url.length <= 10)
    {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.write("not found");
        res.end();
    }
    User.find({username: req.url.substring(10)}, function(err, user) {
        if (err) return console.error(err);
        console.dir("Retrived file from db.");
        if(user[0])
        {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(JSON.stringify(user[0]));
        }
        else
        {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write("not found");
        }
        res.end();
    });

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

  client.on('updateEvs', function(data) {
        data = JSON.parse(data);

        //TODO: CHECK FOR VALID USER MAKING MODIFICATIONS - NO SECURITY HERE FOR NOW

        User.findOne({username: data["uname"]}, function(err, user) {

          if (user)
          {

            user.events = JSON.stringify(data['events']);
            user.save(function(err, funct) {
                if(!err){
                    console.dir("User Events Updated.");
                } else {
                    console.dir("Failed to save new user events: ");
                    console.dir(err);
                    client.emit('failedDB', "-1");
                }
            });
          }
          else
          {
              console.dir("User not found.");
              client.emit('failedDB', "-1");
          }
        });
    });

  client.on('register', function(data) {
        data = JSON.parse(data);
        console.log("THE DATA IS EQUAL TO: ");
        console.log(data);

        if(!checkNewUserData(data))
        {
            console.log("Invalid user data");
            client.emit('invalidData', "-1");
            return;
        }

        User.findOne({username: data["username"]}, function(err, user) {

          if (!user)
          {//Username not taken
            var tutorB = data["type_of_user"] == "Yes" ? true : false;
            var adminB = false;
            var eventsJSON = JSON.stringify(data["events"]);
            var input_user = new User({name: data["name"], email: data["email"], username: data["username"], password: data["password"], tutor: tutorB, admin: adminB, subjects: data["subjects"], events: eventsJSON});
            console.log("This is the input_user:");
            console.log(input_user);
            input_user.save(function(err, funct) {
                if(!err){
                    console.dir("New User Saved.");
                    client.emit('success', "0");
                } else {
                    console.dir("Failed to save user: ");
                    console.dir(err);
                    client.emit('failedDB', "-1");
                }
            });
          }
          else
          {
              client.emit('duplicatedUsername', "-1");
          }
        });
    });


  client.on('subscribe', function(data){

    User.findOne({username: data.user}, function(err, user) {

      if (!user) {//Username not taken

        console.log("no user with that name");

      }else{

        var room = 0;

        var chats = user.chats;

        var index = -1;

        for (var i = 0; i < chats.length; i++){
          if(chats[i].user == data.receiver){
            index = i;
          }
        }

        console.log("index",index)

        if(index < 0){

          Chat.count(function(err, c){

            room = c;

          });
          var messages = [];

          //creates a new room for the conversation
          var chatRoom = new Chat({roomName: room, messages:messages});
          chatRoom.save(function(err, funct) {
            console.dir("New room Saved.");
          });

          var userChats = chats.slice(0);
          var chatUser = {room:room, user: data.receiver};

          userChats.push(chatUser);

          user.chats = userChats;

          user.save();

          User.findOne({username: data.receiver}, function(err, receiver){

            var reChats = receiver.chats.slice(0);

            var chatReceiver = {room:room, user: data.user};

            reChats.push(chatReceiver);

            receiver.chats = reChats;

            receiver.save();

          });

          console.log(data.user, ' logging into room ', room);
          client.join(room);

        }else{
          room = chats[index].room;

          console.log(data.user, ' logging into room ', room);
          client.join(room);

        }

        Chat.findOne({roomName: room}, function(err, chatRoom){

          if(chatRoom){

            var log = {room: room, log:chatRoom.messages};

            client.emit('message log', log);
          }

        });

      }
    });

  });

  client.on('message', function(data){
        console.log(data);
        io.sockets.in(data.room).emit('message', data);

        Chat.findOne({roomName: data.room}, function(err, chat){

          var addmsg = [];
          if(chat.messages){
            var addMsg = chat.messages.slice(0);
          }
          var newMessage = {msg:data.msg, sender:data.sender}
          addMsg.push(newMessage);
          chat.messages = addMsg;
          chat.save();

        })
  });


});

http.listen(4200, function(){
  console.log('listening SOCKET on *:4200');
});

module.exports = router;
