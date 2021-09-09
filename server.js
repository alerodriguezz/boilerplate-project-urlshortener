require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const dns= require("dns")
const cors = require('cors');
const mongoose = require("mongoose");
const urlparser = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect( process.env['DB_URL']
, { useNewUrlParser: true, useUnifiedTopology: true });

/*Assign Mongoose Schema to a variable
This is not necessary but will make your code easier to read */
const schema = mongoose.Schema({url: 'string' });
const Url = mongoose.model('Url',schema);

//middleware to handle post 
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/shorturl', (req, res, next)=>{
    const original_url= req.body.url
    try{
       dns.lookup(urlparser.parse(original_url).hostname, (err, address, family) => {  
            if (err || !address) {
      res.json({error: "invalid url"});
    } else{
          let shortened_url = Math.floor(Math.random()*100000).toString();
            // console.log('data: ', req.body.url);
         // res.json({ original_url: original_url,
          //short_url: shortened_url });
          const url = new Url({url : original_url})
          url.save((err,data) => {
            res.json({
              original_url: data.url,
              short_url: data.id
            })
          })
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
app.get('/api/shorturl/:shorturl', function(req, res) {
   let shorturlStr= req.params.shorturl
   Url.findById(shorturlStr,(err,data)=> {
     if(!data){
       res.json({error: "invalid url"})
     }
     else{
         res.redirect(301, data.url);
     }
   })

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
