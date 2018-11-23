var express = require('express');   //Express Web Server 
var bodyParser = require('body-parser'); //connects bodyParsing middleware
var formidable = require('formidable');
var path = require('path');     //used for file path
var fs =require('fs-extra');    //File System-needed for renaming file etc
var cors = require('cors');
var tesseract = require('node-tesseract');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});
app.use(cors());
/* ========================================================== 
 bodyParser() required to allow Express to see the uploaded files
============================================================ */
app.use(bodyParser({defer: true}));

app.route('/upload').post(function (req, res, next) {
  var form = new formidable.IncomingForm();
    form.uploadDir = "./img";       
    form.keepExtensions = true;
    var upload_path = null;
    form.parse(req, function(err, fields, files) {
	tesseract.process(files.file.path, function(err, text) {
		if(err) {
			throw err;
			console.error(err);
		} else {
			lines = text.split(/\r?\n/);
			modelYear = model = year = "Not Found, Please Select Hight Resolution Image";
			for(var x = 0; x < lines.length; x ++){
			    if(lines[x].startsWith("Model") ){
				modelYear = lines[x].substring(lines[x].lastIndexOf(' ') + 1);
				var pipIndex = modelYear.lastIndexOf('|') !== -1 ? modelYear.lastIndexOf('|') : (modelYear.lastIndexOf('/') !== -1 ? modelYear.lastIndexOf('/') : -1 );
				if (pipIndex !== -1)
					model = modelYear.substring(0, pipIndex);
					year = modelYear.substring(model.length + 1);
				break;
			    }
			}
			res.send(JSON.stringify({modelYear: modelYear, model: model, year: year, 'raw': text, 'path': files.file.path})); 
		}
	});
	
    });
       
});

var server = app.listen(3030, function() {
	console.log('Listening on port %d', server.address().port);
});
