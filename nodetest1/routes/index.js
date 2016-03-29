var express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var router = express.Router();

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

io.on('connection', function(client){
  console.log('a user connected');

  client.on('register', function(data) {
        console.log("THE DATA IS EQUAL TO: ");
        console.log(data);
    });
});

http.listen(4200, function(){
  console.log('listening SOCKET on *:4200');
});

module.exports = router;
