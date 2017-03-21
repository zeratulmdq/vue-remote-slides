var fs = require('fs');
var path = require('path');
var express = require('express');
var apiRoutes = express.Router();
var busboy = require('connect-busboy');

var currentFile = require('../utils/file');

function processFile(fieldname, file, filename, encoding, mimetype) {
	let parts = filename.split('.');
	parts.pop();
	currentFile.fullName = filename;
	currentFile.name = parts.join('.');
	currentFile.path = '/files/' + filename;
	currentFile.mimetype = mimetype;
	fstream = fs.createWriteStream(path.join(__dirname + '/../../public' + currentFile.path));
	file.pipe(fstream);

	return currentFile;
}

module.exports = function(io) {
	apiRoutes.use(busboy());

	apiRoutes.post('/upload', (req, res) => {
	    if (req.busboy) {
	    	
		    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		    	currentFile = processFile(fieldname, file, filename, encoding, mimetype);
		    });
		    req.pipe(req.busboy);
		    req.busboy.on('finish', () => {
		    	io.emit('files.new', currentFile);
		    	return res.status(201).send({ 
					success: true, 
					message: 'File uploaded correctly.' 
				});
		    });
		}
	});

	return apiRoutes;
}
