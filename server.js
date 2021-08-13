require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const dns= require("dns")
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//middleware to handle post 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/shorturl', (req, res, next)=>{
    const original_url= req.body.url
    try{
    const urlObject = new URL(original_url);
       dns.lookup(urlObject.hostname, (err, address, family) => {  

        if (err) {
      res.json({error: "invalid URL"});
    } else{
          let shortened_url = Math.floor(Math.random()*100000).toString();
            // console.log('data: ', req.body.url);
          res.json({ original_url: original_url,
          short_url: shortened_url });
    }
    });

    }
    catch (e){
      res.json({error:"invalid url"});
    }
   

   
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
