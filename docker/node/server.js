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

var upload = multer({ dest: 'uploads/' })

app.post('/result',(req,res) =>{
  let filepath = req.body.filepath ;
  console.log( req.body)

 
  var formData = {
    file: fs.createReadStream(filepath)
  };

  let img  

  let backendIngressIP = "http://childgen-python.default.svc.cluster.local:5000/"
  //let backendIngressIP = "http://localhost:5000/"
  request.post({url: backendIngressIP+'gen', formData: formData}, function(err, httpResponse, body) {
    if (err) {
      res.status(405).send(err);
      return console.error('upload failed:', err);
    }
    
    img = body.split(",")
    console.log(img)
    console.log('Upload successful!  Server responded with:', body);
    res.status(200).send(body);
    ///upload/497e3f9a7b6bec86e51e1d0644ad55b2.jpeg,conv/color-497e3f9a7b6bec86e51e1d0644ad55b2.jpeg

  });
  //res.status(200).send(img);

});

app.post('/upload',upload.single('image') ,(req, res,next) => {
 


 
  let newfn = req.file.destination+req.file.filename+"."+req.file.mimetype.substr(req.file.mimetype.indexOf("/")+1,req.file.mimetype.length);
  console.log(newfn)
  fs.rename(req.file.path,newfn, function (err) {
    if (err) throw err;
    fs.stat(newfn, function (err, stats) {
      if (err) throw err;
      console.log('stats: ' + JSON.stringify(stats));

 return res.status(200).send(newfn);



  var formData = {
    file: fs.createReadStream(newfn)
  };
  let img
  request.post({url:'http://127.0.0.1:5000/gen', formData: formData}, function(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log(body)
    img = body.split(",")
    
    console.log('Upload successful!  Server responded with:', body);
  });
  res.status(200).send(img);
  /*

  });

  */
  });
  });
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);