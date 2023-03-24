/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
const fs = require("fs");

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

var express = require('express');
var app = express();

app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

// TODO: XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
// var cs142models = require('./modelData/photoApp.js').cs142models;
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            // console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    // response.status(200).send(cs142models.userListModel());
    if(!Object.prototype.hasOwnProperty.call(request.session,"user_id")){
        response.status(401).send("please login");
        return;
    }
    // TODO:
    User.find({}, function(err, users) {
        if (err) {
            console.err('Doing /user/list error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (users.length === 0) {
            response.status(400).send('Missing userList');
            return;
        }

        let userList = users.map(user => {
            return {
                _id : user._id.valueOf(),
                first_name : user.first_name,
                last_name : user.last_name
            };
        });
        console.log( userList);
        response.status(200).send(JSON.stringify(userList));
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if(!Object.prototype.hasOwnProperty.call(request.session,"user_id")){
        response.status(401).send("please login");
        return;
    }
    var id = request.params.id;
    User.find({_id: id}, function(err, user) {
        if (err) {
            if (err.name === 'CastError') {
                response.status(400).send("Bad parms, please input valid user id.");
                return;
            }
            console.error('Doing /user/id error: ', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        // console.log('User with id', user[0]);
        let userData = {
            _id : user[0]._id.valueOf(), 
            first_name : user[0].first_name, 
            last_name : user[0].last_name, 
            location : user[0].location, 
            description : user[0].description, 
            occupation : user[0].occupation
        };
        response.status(200).send(JSON.stringify(userData));
    });
    
    // var user = cs142models.userModel(id);
    // if (user === null) {
    //     console.log('User with _id:' + id + ' not found.');
    //     response.status(400).send('Not found');
    //     return;
    // }
    // response.status(200).send(user);
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    if(!Object.prototype.hasOwnProperty.call(request.session,"user_id")){
        response.status(401).send("please login");
        return;
    }
    var id = request.params.id;
    Photo.find({user_id: id}, function(err, data) {
        if(err) {
            if (err.name === 'CastError') {
                response.status(400).send("Bad parms, please input valid user id.");
                return;
            }
            console.error('Doing /photosOfUser/id error: ', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (data.length === 0) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send('Not Found');
            return;
        }
        console.log('Photo', data);
        let photos = JSON.parse(JSON.stringify(data));
        async.each(photos, function(photo, callbackPhoto) {
            delete photo.__v;
            async.each(photo.comments, function(comment, callbackComment) {
                User.findById({_id: comment.user_id}, function(error, userInfo) {
                    delete comment.user_id;
                    let userData = {
                        _id : userInfo._id.valueOf(), 
                        first_name : userInfo.first_name, 
                        last_name : userInfo.last_name, 
                    };
                    comment.user = userData;
                    callbackComment(error);
                });
            }, function(error) {
                // if(error) {
                //     callbackPhoto(error);
                // }
                // else {
                //     callbackPhoto();
                // }
                callbackPhoto(error);
            });
            
        },
        function(error) {
            if (error) {
                response.status(500).send(JSON.stringify(error));
            }
            else {
                response.status(200).send(photos);
            }
        });
    });
    // var photos = cs142models.photoOfUserModel(id);
    // if (photos.length === 0) {
    //     console.log('Photos for user with _id:' + id + ' not found.');
    //     response.status(400).send('Not found');
    //     return;
    // }
    // response.status(200).send(photos);
});



app.post('/admin/login', function(request, response) {
    var login_name = request.body.login_name;
    var password = request.body.password;
    console.log(request.body.password);
    User.findOne({login_name: login_name}, function(err, query) {
        if (query === null) {
            response.status(400).send(login_name + "doesn't exist");
            return;
        }
        if (err) {
            response.status(500).send(JSON.stringify(err));
            return;
        }
        console.log("query.password");
        console.log(query.password);
        console.log("password");
        console.log(request.body.password);
        
        if (query.password !== password) {
            response.status(400).send("password does not match with login name");
            return;
        }
        request.session.login_name = query.login_name;
        // console.log(request.session.login_name);
        // console.log(query.login_name);

        request.session.user_id = query._id;
        request.session.save();
        let user = {};
        user._id = query._id;
        user.first_name = query.first_name;
        response.status(200).send(user);
    });
});

app.post('/admin/logout', function(request, response) {
    if (request.session.login_name && request.session.user_id) {
		delete request.session.user_id;
		delete request.session.login_name;

		request.session.destroy(function (err) {
			response.status(500).send(JSON.stringify(err));
		});
		response.status(200).send('User logged out');
	} else {
		response.status(400).send('User not logged in');
	}
});

app.post('/user', function(request, response) {
    let user = request.body;
    if (user.password === null || user.password === "" || user.first_name === null ||
    user.first_name === "" || user.last_name === null || user.last_name === "") {
        console.log(user);
        console.log(user.password === null);
        response.status(400).send("You should input valid first name, last name and password");
        return;
    }
    User.findOne({login_name: user.login_name}, function(err, query) {
        if (err) {
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (query !== null) {
            response.status(400).send("This name has existed, you must choose another one.");
            return;
        }
        function done_callback(err1, obj) {
            if (err1) {
                response.status(500).send(JSON.stringify(err1));
                retunr;
            }
            obj.save();
            response.status(200).send("registered successfully");
        }
        User.create(user, done_callback);
    })
})


app.post('/commentsOfPhoto/:photo_id', function(request,response){
    if(!Object.prototype.hasOwnProperty.call(request.session,"user_id")){
        response.status(401).send("please login");
        return;
    }
    var photo_id = request.params.photo_id;
    var text = request.body.comment;
    if(text === "" || text === null){
        response.status(400).send("empty comment");
        return;
    }
    Photo.findOne({_id : photo_id}, function(err, query){
        if(err){ 
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if(query === null){
            response.status(400).send("Can't find the photo");
            return;
        }
        
        let cur = {};
        cur.comment = text;
        cur.user_id = request.session.user_id;
        cur.date_time = new Date().valueOf();
        query.comments.push(cur);
        query.save();
        console.log("comment saved");
        response.status(200).send("comment saved");
        
    });
});

app.post('/photos/new', function(request, response){
    if(!Object.prototype.hasOwnProperty.call(request.session,"user_id")){
        response.status(401).send("please login");
        return;
    }
    processFormBody(request, response, function (err) {
        if (err || !request.file) {      
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if(request.file.fieldname !== "uploadedphoto"){
            response.status(400).send("wrong filename");
            return;
        } 
        const timestamp = new Date().valueOf();
        const filename = 'U' +  String(timestamp) + request.file.originalname;
    
        fs.writeFile("./images/" + filename, request.file.buffer, function (err1) {
            if(err1){
                response.status(400).send(JSON.stringify(err1));
                return;
            }
            function doneCallback(err2, photo) {
                if(err2){
                    response.status(500).send(JSON.stringify(err2));
                    return;
                }
                photo.save();
                response.status(200).send("sucessfully create new photo");
            }
            let photo = {};
            photo.file_name = filename;
            photo.date_time = timestamp;
            photo.user_id = request.session.user_id;
            photo.comments = [];
            Photo.create(photo,doneCallback);
        });
    });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


