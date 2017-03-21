var port = process.env.PORT || 3000;

var file = require('./utils/file.js');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {path: '/api/socketio'});

io.on('connection', (socket) => {
	console.log(socket.id);

	socket.on('files.current', () => {
		if(file.path)
			socket.emit('files.new', file);
	});

	socket.on('page.change', (data) => {
		io.emit('page.change', data);
	});
});

app.use(express.static(path.join(__dirname + '/../public/')));
var apiRoutes = require('./router/api.js')(io);
app.use('/api', apiRoutes);

/**
 * Start HTTP server
 */
server.listen(port, () => {
  	console.log('Server running: port %d', port);
});
