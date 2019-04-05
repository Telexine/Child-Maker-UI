'use strict';
var request = require('request');
const express = require('express');
var path = require('path'),
fs = require('fs'),
bodyParser = require('body-parser')
var multer  = require('multer')
// Constants
const PORT = 8888;
const HOST = '0.0.0.0';
// App
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/static',express.static('static'));
app.use('/node_modules',express.static('node_modules'));
app.use('/css',express.static('node_modules/materialize-css/dist/css'));
app.use('/js',express.static('node_modules/materialize-css/dist/js'));
app.use('/uploads',express.static('uploads'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/static/index.html'));
});

// use multer for multipart/form-data
var upload = multer({ dest: 'uploads/' })

//get result
app.post('/result',(req,res) =>{
  let filepath = req.body.filepath ;
  console.log( req.body)
  var formData = {
    file: fs.createReadStream(filepath)
  };

  let img  // uploaded image
  //For kubenetes
  //backendsvcname = "http://childgen-python.default.svc.cluster.local:5000/"
  //For local
  let backendsvcname = "http://localhost:5000/"

  //send file to python backend 
  request.post({url: backendsvcname+'gen', formData: formData}, function(err, httpResponse, body) {
    if (err) {
      res.status(405).send(err);
      return console.error('upload failed:', err);
    }
    // split orignal,result
    img = body.split(",")
    console.log(img)
    console.log('Upload successful!  Server responded with:', body);
    res.status(200).send(body);
  });
 

});
// upload function
app.post('/upload',upload.single('image') ,(req, res,next) => {
  //rename file
  let newfn = req.file.destination+req.file.filename+"."+req.file.mimetype.substr(req.file.mimetype.indexOf("/")+1,req.file.mimetype.length);
  fs.rename(req.file.path,newfn, function (err) {
    if (err) throw err;
    fs.stat(newfn, function (err, stats) {
      if (err) throw err;
      console.log('stats: ' + JSON.stringify(stats));
 return res.status(200).send(newfn);
 
  });
  });
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);