
var express = require('express'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	mongojs = require('mongojs')
	jwt = require('jsonwebtoken'),
	expressJwt = require('express-jwt'),
	app = express(),
	db = mongojs('rsvp'),
	usersCol = db.collection('users'),
	placesCol = db.collection('places');

var jwtSecret = 'fjkdlsajfoew239053/3uk';

app.use(cors());
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/src'));
app.use(expressJwt({ secret: jwtSecret }).unless({ path: [ '/api/login' ]}));


var user = {
  email: '',
  password: ''
};

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
router.route('/login')
	// add login 
	.post(authenticate,function(req,res){
		var token = jwt.sign({
		    email: user.email
		  }, jwtSecret);
		  res.send({
		    token: token,
		    user: user
		  });
	});



// more routes for our API will happen here
router.route('/users')
	// get the users
	.get(function(req, res) {
   		usersCol.find(function(err, docs) {
   			if (err)
   				res.send(err);
	    	res.json(docs);  
		});
	})
	// add user 
	.post(function(req,res){
		usersCol.insert(req.body, function(err,doc){
			if (err) 
				res.send(err);
			res.json(doc);
		});
	});

router.route('/users/:user_id')
	// get the user with that id
	.get(function(req, res) {
		usersCol.findOne({
		    _id: mongojs.ObjectId(req.params.user_id)
		}, function(err, doc) {
			if (err) 
				res.send(err);
		    res.json(doc);
		});
	})
	// update the user with this id
	.put(function(req, res) {
		usersCol.update(
		    { _id : mongojs.ObjectId(req.params.user_id) },
		    { $set : req.body },
		    { multi :true}
		, function(err, doc, lastErrorObject) {
		    if (err)
		    	res.send(err);
		    if (lastErrorObject)
		    	res.send(lastErrorObject);
		    res.send(doc);
		});
	})
	// delete the user with this id
	.delete(function(req, res) {
		usersCol.remove({ 
			_id : mongojs.ObjectId(req.params.user_id) 
		}, function(err, doc) {
			if (err) 
				res.send(err);
		    res.json(doc);
		});
	});

// more routes for our API will happen here
router.route('/places')
	// get the places
	.get(function(req, res) {
   		placesCol.find(function(err, docs) {
   			if (err)
   				res.send(err);
	    	res.json(docs);  
		});
	})
	// add user 
	.post(function(req,res){
		placesCol.insert(req.body, function(err,doc){
			if (err) 
				res.send(err);
			res.json(doc);
		});
	});

router.route('/places/:place_id')
	// get the user with that id
	.get(function(req, res) {
		placesCol.findOne({
		    _id: mongojs.ObjectId(req.params.place_id)
		}, function(err, doc) {
			if (err) 
				res.send(err);
		    res.json(doc);
		});
	})
	// update the user with this id
	.put(function(req, res) {
		placesCol.update(
		    { _id : mongojs.ObjectId(req.params.place_id) },
		    { $set : req.body },
		    { multi :true}
		, function(err, doc, lastErrorObject) {
		    if (err)
		    	res.send(err);
		    if (lastErrorObject)
		    	res.send(lastErrorObject);
		    res.send(doc);
		});
	})
	// delete the user with this id
	.delete(function(req, res) {
		placesCol.remove({ 
			_id : mongojs.ObjectId(req.params.place_id) 
		}, function(err, doc) {
			if (err) 
				res.send(err);
		    res.json(doc);
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

function authenticate(req, res, next) {
  var body = req.body;
  if (!body.email || !body.password) {
    res.status(400).end('Must provide email or password');
  }
  usersCol.findOne({
	    email: body.email,
	    password : body.password
	}, function(err, doc) {
		if (!doc)
		    res.status(401).end('email or password incorrect');
		console.log("tushar");
		user = doc;
		next();
	});
}

app.listen(3000, function () {
  console.log('App listening on localhost:3000');
});
