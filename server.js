'use strict';

const express = require('express');
const socketIO = require('socket.io');

const crawler = require('crawler-request');
const pdf = require('pdf-parse');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const axios = require('axios');

var nykurs;
var datum;
var bidstring;
var askstring;



const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });




const io = socketIO(server);

io.on('connection', (socket) => {
 crawler("http://share.paretosec.com/upload/files/OTC_prices_web.pdf").then(function(response){
    // handle response

    pdf(response).then(function(data) {

    	  var str = data.text; 
  var n = str.search("Exeger");
    
    bidstring = str.slice(n+16, n+19);
    askstring = str.slice(n+20, n+23);
    var kursstring = str.slice(n+23, n+26);

    var bidnr = parseInt(bidstring, 10);

    var asknr = parseInt(askstring, 10);

    var kursnr = parseInt(kursstring, 10);

  var n = str.search("Latest");
var datestring = str.slice(n+14, n+35);

 nykurs = kursstring;
 datum = datestring;
    

    
        
});
    });

  console.log('a user connected');
  io.emit('kurs update', nykurs, bidstring,askstring);
  io.emit('kurs update date', datum);


});
