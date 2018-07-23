var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('quotes.db');

app.use(bodyParser.urlencoded({ extended: true }));

var quotes = [
	{
		id: 1,
		quote: "The best is yet to come",
		author: "Unknown",
		year: 2000
	},
	{
		id: 2,
		quote: "To be Number One",
		author: "Nike",
		year: 2003
	},
	{
		id: 3,
		quote: "Jacky is a genius",
		author: "Earth",
		year: 2015
	}
];

app.get('/', function(request, response) {
	response.send("Get Request received at '/' ");
});

app.get('/quotes', function(request, response) {
	console.log("Get a list of all quotes as json");
	if (request.query.year) {
		//response.send("Return a list of quotes from the year: " + request.query.year)
        db.all('SELECT * FROM quotes WHERE year = ?', [request.query.year], function(err, rows) {
            if (err) {
               response.send(err.message);
            } else {
               console.log("Return a list of quotes from the year: " + request.query.year);
               response.json(rows);
            }
        });
	} else {
        db.all('SELECT * FROM quotes', function processRows(err, rows) {
            if (err) {
               response.send(err.message);
            } else {
               for (var i = 0; i < rows.length; i++) {
                    console.log(rows[i].quote);
               }
               response.json(rows);
            }
        });
	}
});

app.get('/quotes/:id', function(request, response) {
	console.log("return quote with the ID: " + request.params.id);
        db.get('SELECT * FROM quotes WHERE rowid = ?', [request.params.id], function(err, row) {
            if (err) {
               console.log(err.message);
            } else {
               response.json(row);
            }
        });
});

app.post('/quotes', function(request, response) {
	console.log("Insert a new quote: " + request.body.quote);
    db.run('INSERT INTO quotes VALUES (?, ?, ?)', [request.body.quote, request.body.author, request.body.year], function(err) {
        if (err) {
           console.log(err.message);
        } else {
           response.send('Inserted quote with id: ' + this.lastID);
        }
    });
});

app.listen(3000, function(){
	console.log('Listening on Port 3000');
});

