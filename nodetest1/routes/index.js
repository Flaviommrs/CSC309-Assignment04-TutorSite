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
var currentUser = null;

//DB TESTER PAGE
router.get('/data', function(req, res, next) {

    User.find({}, function(err, batman) {
        if (err) return console.error(err);
        console.dir("Retrived file from db.");
        res.render('index.html', {group: batman});
    });
});

//LOGOUT PAGE
router.get('/logout', function(req, res, next) {
    res.clearCookie('tutorMeData');
    res.clearCookie('MyCookie');
    res.redirect('/');
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
        currentUser = log_username;
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

router.post('/facebookLog', function(req, res, next){

  var log_username = req.body.username;

  var secret = 'tutorMeSecretString';
  var val = cookieSign.sign(log_username, secret);
  res.clearCookie('tutorMeData');
  res.cookie('tutorMeData' , val, {expire : new Date() + 9999});

  res.redirect('/homepage');

});

router.post('/facebookSignUp',function (req, res, next){


  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var email = req.body.email;

  console.log(username,password, name, email);

  User.findOne({username: username}, function (err, user) {

    if (!user)
    {//Username not taken
      var input_user = new User({name:username, email:email, username: username, password: password});
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
    else
    {

    }
  });

  res.redirect('/fbsignup');
});

router.get('/fbsignup', function (req, res, next){

  res.render('signup.html', {});

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage_inital.html', {});
});

/* GET admin page. */
router.get('/admin', function(req, res, next) {
    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.render('admin.html', {result: false, info: null});
    }
    var result = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(result)
    {
        User.findOne({username: result}, function(err, user) {

          if (user)
          {
              if(user.admin)
              {
                  res.render('admin.html', {result: true, info: null});
              }
              else
              {
                  res.render('admin.html', {result: false, info: null});
              }

          }
          else
          {
              res.render('admin.html', {result: false, info: null});
          }
        });
    }
    else
    {
        res.render('admin.html', {result: false, info: null});
    }
});
/* GET admin page. */
router.get('/admin/users', function(req, res, next) {
    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.render('admin.html', {result: false, info: null});
    }
    var result = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(result)
    {
        User.findOne({username: result}, function(err, user) {

          if (user)
          {
              if(user.admin)
              {
                  User.find({}, function(err, db_data) {
                      if (err) return console.error(err);
                      res.render('admin.html', {result: true, info: db_data});
                  });
              }
              else
              {
                  res.render('admin.html', {result: false, info: null});
              }

          }
          else
          {
              res.render('admin.html', {result: false, info: null});
          }
        });
    }
    else
    {
        res.render('admin.html', {result: false, info: null});
    }
});
/* GET admin page. */
router.get('/admin/chat', function(req, res, next) {
    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.render('admin.html', {result: false, info: null});
    }
    var result = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(result)
    {
        User.findOne({username: result}, function(err, user) {

          if (user)
          {
              if(user.admin)
              {
                  Chat.find({}, function(err, db_data) {
                      if (err) return console.error(err);
                      res.render('admin.html', {result: true, info: db_data});
                  });
              }
              else
              {
                  res.render('admin.html', {result: false, info: null});
              }

          }
          else
          {
              res.render('admin.html', {result: false, info: null});
          }
        });
    }
    else
    {
        res.render('admin.html', {result: false, info: null});
    }
});
/*DELETE USER FROM DB*/
router.get('/admin/delete&username=*', function(req, res, next) {
    if(req.url <= 23)
    {
        res.redirect('/admin/users');
    }
    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.render('admin.html', {result: false, info: null});
    }
    var result = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(result)
    {
        User.findOne({username: result}, function(err, user) {

          if (user)
          {
              if(user.admin)
              {
                  var userToDelete = req.url.substring(23);
                  User.remove({ username: userToDelete }, function(err) {
                    res.redirect('/admin/users');
                  });
              }
              else
              {
                  res.render('admin.html', {result: false, info: null});
              }

          }
          else
          {
              res.render('admin.html', {result: false, info: null});
          }
        });
    }
    else
    {
        res.render('admin.html', {result: false, info: null});
    }
});
/*DELETE CHATROOM FROM DB*/
router.get('/admin/delete&roomname=*', function(req, res, next) {
    console.log("Right where I should be");
    if(req.url <= 23)
    {
        res.redirect('/admin/chat');
    }
    var secret = 'tutorMeSecretString';
    if(!req.cookies.tutorMeData)
    {
        res.render('admin.html', {result: false, info: null});
    }
    var result = cookieSign.unsign(req.cookies.tutorMeData, secret);
    if(result)
    {
        User.findOne({username: result}, function(err, user) {

          if (user)
          {
              if(user.admin)
              {
                  try
                  {
                        var chatToDelete = parseInt(req.url.substring(23));
                        Chat.remove({ roomName: chatToDelete }, function(err) {
                          res.redirect('/admin/chat');
                        });
                  } catch (e)
                  {
                      res.redirect('/admin/chat');
                  }
              }
              else
              {
                  res.render('admin.html', {result: false, info: null});
              }

          }
          else
          {
              res.render('admin.html', {result: false, info: null});
          }
        });
    }
    else
    {
        res.render('admin.html', {result: false, info: null});
    }
});


/* GET signup page. */
router.get('/signup', function(req, res, next) {
    res.render('signup.html', {});
});


//POST for edit profile
router.post('/editingProfile', function(req, res, next){
  console.dir(req.body.number);

  if (req.body.name != '') {
    console.dir("in if");
    User.update({username:currentUser}, {$set:{name:req.body.name}}, function(err, result) {
      console.dir("update");
    });
  }

  if (req.body.number != '') {
    console.dir("in if");
    User.update({username:currentUser}, {$set:{phone:req.body.number}}, function(err, result) {
      console.dir("update");
    });
  }

  if (req.body.email != '') {
    console.dir("in if");
    User.update({username:currentUser}, {$set:{email:req.body.email}}, function(err, result) {
      console.dir("update");
    });
  }

  if (req.body.rate != '') {
    console.dir("in if");
    User.update({username:currentUser}, {$set:{rate:req.body.rate}}, function(err, result) {
      console.dir("update");
    });
  }

  if (req.body.occupation != '') {
    console.dir("in if");
    User.update({username:currentUser}, {$set:{occupation:req.body.occupation}}, function(err, result) {
      console.dir("update");
    });
  }

  if (req.body.education != '') {
    console.dir("in if");
    User.update({username:currentUser}, {$set:{education:req.body.education}}, function(err, result) {
      console.dir("update");
    });
  }

  if (req.body.experience != '') {
    console.dir("in if");
    User.update({username:currentUser}, {$set:{experience:req.body.experience}}, function(err, result) {
      console.dir("update");
    });
  }

  if (req.body.about != '') {
    console.dir("in if");
    User.update({username:currentUser}, {$set:{about:req.body.about}}, function(err, result) {
      console.dir("update");
    });
  }

  res.redirect("/profile&username=" + currentUser);

});

/* GET edit profile page. */
router.get('/editProfile', function(req, res, next) {
  User.findOne({username: currentUser}, function(err, user) {
    res.render('editprofile.html', {userinfo: user});
  });
});

/* GET fb login page. Test*/
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
        res.render('homepage_user.html', {current: currentUser});
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

  var rating_var = 0;

  if (req.body.star1 != undefined){
    console.dir(req.body.star1);
    rating_var = 1;
  };

    if (req.body.star2 != undefined){
    console.dir(req.body.star2);
    rating_var = 2;
  };
    if (req.body.star3 != undefined){
    console.dir(req.body.star3);
    rating_var = 3;
  };
    if (req.body.star4 != undefined){
    console.dir(req.body.star4);
    rating_var = 4;
  };
    if (req.body.star5 != undefined){
    console.dir(req.body.star5);
    rating_var = 5;
  };


  var comment = new Review({reviewee: req.body.tutName, reviewer: currentUser,
  rating: rating_var, commented: req.body.comment});

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

/*
Search cases:
user looks for username
user looks for name
user looks for area
user look for price
user looks subject

recommmendation system based on rating
*/

/* POST search page */
var searchedTerm = null;
var resultUsername = null;
var resultNames = null;
var resultPrice = null;
var resultSubject = null;
var reccommened = null;

router.post('/searchFind', function(req, res, next){
  searchedTerm = req.body.search;
  console.dir(searchedTerm);

  /* Find username */
  User.findOne({username: searchedTerm}, function(err, user) {
    resultUsername = user;
    //console.dir(resultUsername);
    return;
  });

  User.find({name: searchedTerm}, function(err, name) {
    resultNames = name;
    //console.dir(resultNames);
    return;
  });

  User.find({rate: searchedTerm}, function(err, price) {
    resultPrice = price;
    //console.dir(resultPrice);
    return;
  });

  User.find({subjects: { $in: [searchedTerm] }}, function(err, subject) {
    resultSubject = subject;
    //console.dir(resultSubject);
    return;
  });

  /* Recommended feature */


  res.redirect('/search');

});

//Subject Searchs
router.post('/searchSubject', function(req, res, next){
  User.find({subjects: { $in: [req.body.subject] }}, function(err, subject) {
    resultSubject = subject;
    //console.dir(resultSubject);
    return;
  });

  res.redirect('/search');
});

/* GET search page. */
router.get('/search', function(req, res, next) {
  console.dir(searchedTerm);
  console.dir(resultUsername);
  console.dir(resultNames);
  console.dir(resultPrice);
  console.dir(resultSubject);

  res.render('search.html', {search: searchedTerm, uname: resultUsername, names: resultNames, 
    price: resultPrice, subject: resultSubject});
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

  client.on('updateDBEntryUser', function(data) {
        data = JSON.parse(data);

        //TODO CHECK FOR VALID USER MAKING MODIFICATIONS - NO SECURITY HERE FOR NOW

        User.findOne({_id: data["_id"]}, function(err, user) {

          if (user)
          {
                for(var propertyName in data) {
                   user[propertyName] = data[propertyName];
                }
                console.dir(user);
                user.save(function(err, funct) {
                    if(!err){
                        console.dir("User Updated.");
                        client.emit('success', "0");
                    } else {
                        console.dir("Failed to update user");
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

        console.log("no user with that name", err);

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
