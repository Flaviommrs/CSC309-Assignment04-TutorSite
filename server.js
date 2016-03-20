/* Use This File to create the server */
var http = require("http"),
    fs = require("fs"),
    urlModule = require("url");

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

//TODO: Change this as needed
var urlDB = 'mongodb://localhost:27017/tutorMe';

var port = 3000;

var server = http.createServer(function(request, response) {
    var url = request.url;

    console.log("Received request of " + url);

    /* Separates the multiple parameters of the url and inserts into a parameter
     array */
    var temp = url.split('/');
    var parameters = [];
    for(i = 0; i < temp.length; i++)
    {
        if(temp[i] != '' && temp[i] != "index.html"){
            parameters.push(temp[i]);
        }
    }

    /* Selects the response according to the URL */
    if(parameters.length != 0)
    {
        if(parameters[0] == "users")
        {
            //http://blog.modulus.io/mongodb-tutorial
            MongoClient.connect(urlDB, function (err, db) {
              if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
              } else {
                //HURRAY!! We are connected. :
                console.log('Connection established to DB on ', urlDB);

                // Get the documents collection
                var collection = db.collection('users');

                //Create some users
                var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
                var user2 = {name: 'modulus user', age: 22, roles: ['user']};
                var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

                // Insert some users
                collection.insert([user1, user2, user3], function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                  }
                });

                //Close connection
                //db.close();

                }
            });

        }else if(parameters[0] == "facebookAPI.js"){

        	var file = fs.readFileSync('./facebookAPI.js', 'utf8');
		    response.writeHead(200, {"Content-Type": "text/javascript"});
		    response.end(file);


        }else if(parameters[0] == "login.js"){

        	var file = fs.readFileSync('./login.js', 'utf8');
		    response.writeHead(200, {"Content-Type": "text/javascript"});
		    response.end(file);

        }else if(parameters[0] == "fblog"){
        
        	var file = fs.readFileSync('./facebookLog.html', 'utf8');
		    response.writeHead(200, {"Content-Type": "text/html"});
		    response.end(file);

        }
        else
        {
            //if no specific URL is given, return a simple not found webpage
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write("<html><body>404 - URL not found</html></body>");
            response.end;
        }
    }
    else
    {
        //TODO: PLACEHOLDER
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write("<html><body>404 - URL not found</html></body>");
        response.end;
        //return the index html file
        /*
        fs.readFile('./index.html', function (err, html) {
            if (err) {
                throw err;
            }
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        });
        */
    }

});

//boot up server to list on the selcted port
server.listen(port);

console.log('Server available at http://127.0.0.1:' + port);
