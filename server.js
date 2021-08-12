require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//middleware to handle post 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/shorturl', (req, res, next)=>{
   console.log('data: ', req.body.url);
   //res.redirect('/');
  res.json({ original_url: req.body.url });
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

/*
// Display json
app.post('/api/shorturl', (req, res)=> {
  var urlStr = req.body.url
  res.json({ original_url: `${urlStr}` });
});
*/


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
