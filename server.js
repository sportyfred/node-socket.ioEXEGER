'use strict';

const express = require('express');
const socketIO = require('socket.io');

const crawler = require('crawler-request');
const pdf = require('pdf-parse');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';





const app = require('express')();
const http = require('http').Server(app);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

app.get("/api", (req, res, next) => {
   crawler("http://share.paretosec.com/upload/files/OTC_prices_web.pdf").then(function(response){
    // handle response

    pdf(response).then(function(data) {

        var str = data.text; 
  var n = str.search("Exeger");
    
    var bidstring = str.slice(n+16, n+19);
    var askstring = str.slice(n+20, n+23);
    var kursstring = str.slice(n+23, n+26);

    var bidnr = parseInt(bidstring, 10);

    var asknr = parseInt(askstring, 10);

    var kursnr = parseInt(kursstring, 10);

  var n = str.search("Latest");
var datestring = str.slice(n+14, n+35);

 var nykurs = kursstring;
 var datum = datestring;
    

 
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ date: datum, bid: bidstring, ask: askstring, kurs: kursstring }, null, 3));

  

});
   
        
});

});



http.listen(PORT, function() {
   console.log('listening on *:3000');
});

const io = socketIO(http);

io.on('connection', (socket) => {
 crawler("http://share.paretosec.com/upload/files/OTC_prices_web.pdf").then(function(response){
    // handle response

    pdf(response).then(function(data) {

    	  var str = data.text; 
  var n = str.search("Exeger");
    
    var bidstring = str.slice(n+16, n+19);
    var askstring = str.slice(n+20, n+23);
    var kursstring = str.slice(n+23, n+26);

    var bidnr = parseInt(bidstring, 10);

    var asknr = parseInt(askstring, 10);

    var kursnr = parseInt(kursstring, 10);

  var n = str.search("Latest");
var datestring = str.slice(n+14, n+35);

 var nykurs = kursstring;
 var datum = datestring;
   var farg = ''; 

 var gammalkurs = 180;
if (nykurs < gammalkurs){
farg = 'red';
}
else
{
farg = 'green';
}

  console.log('a user connected');
  io.emit('kurs update', nykurs, bidstring,askstring,farg);
  io.emit('kurs update date', datum);
gammalkurs = nykurs;
  

});
   
        
});
    });
