var express = require('express')
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var cool = require('cool-ascii-faces');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://yerojcuolrgxkw:slt5jv9rdW35yBUkYDco0xWTlQ@ec2-107-21-102-69.compute-1.amazonaws.com:5432/d6phr6fpg5fdgg?ssl=true';

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.set('port', (process.env.PORT || 5000))

// app.get('/', function(request, response) {
// 	response.send(cool());
// });

var api = express()
api.get('/todos', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM todos', function(err, result) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
			} else {
				response.send(result.rows);
			}
		});
	});
});

api.post('/todos', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query("INSERT INTO todos(story) values($1)", [request.body.story], function(err, result) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
			} else {
				response.send(result);
				// response.json(request.body);
			}
		});
	});
});

api.get('/equipments', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('SELECT * FROM equipments', function(err, result) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
			} else {
				response.send(result.rows);
			}
		});
	});
});


app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'))
});

app
// .use('/assets', express.static(path.join(__dirname, 'assets')))
	.use('/api', api)
	.use(express.static('www'))
	// .use(renderApp)
;