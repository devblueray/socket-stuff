var http = require('http');
var fs = require('fs');
var stat = require('os');
var count = 0;
console.log(stat.uptime());
var server = http.createServer(function (req, res) {
  fs.readFile('./index.html', function(error, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data, 'utf-8');
  });
}).listen(3000, "0.0.0.0");
console.log('Server running at http://127.0.0.1:3000/');
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  setInterval(function() { socket.emit('uptime', stat.uptime())},10000);
  setInterval(function() { socket.emit('freemem', stat.freemem())},5000);
  
  //setInterval(function() {var myStats = new Array(stat.uptime(),stat.freemem())},5000);
  //console.log(myStats[0]);
  //console.log(myStats[1]);
  //setInterval(function() {socket.emit('memory',myStats },3000);
  count++;
  console.log('User connected. ' + count + ' user(s) present.');
  socket.emit('users', { number: count });
  socket.broadcast.emit('users', { number: count });
  socket.on('disconnect', function () {
    count--;
    console.log('User disconnected. ' + count + ' user(s) present.');
    socket.broadcast.emit('users', { number: count });
   
  });

  socket.on('message', function(data) {
  	console.log(data.text);
  	socket.broadcast.emit('message', data);
	socket.emit('message', data);

  });	
 
});
