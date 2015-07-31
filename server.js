
var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(express.static(__dirname + '/src'));

app.listen(3000, function () {
  console.log('App listening on localhost:3000');
});
