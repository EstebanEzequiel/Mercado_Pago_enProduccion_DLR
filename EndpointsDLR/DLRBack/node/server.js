var devMode = false;
var workPath = process.cwd();
process.argv.forEach(function (val, index, array) {
  if(val == '--dev')
    devMode = true;
  if(array.length>2 && index==array.length-1 && !val.includes('--'))
    workPath = val;
});

if(devMode){
  workPath = __dirname;
  process.cwd = function(){
    return __dirname;
  } 
}else{
  console.debug = function(message){
    process.stdout.write(message);
  }
}

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var http = require('http');
var app = express();
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync(workPath + "/srv-config.json"));
var ezequiel = require('./ezequiel/ezequiel');
var getrouter = require('./get/getrouter');
var mateo = require('./mateo/post');
var mauricio = require('./mauricio/delete');
var path = require('path');
const REST_ENDPOINT = "/api/";
const HTTP_PORT = conf.puerto;
const ROOT_PATH = '/';


let port =process.env.PORT || HTTP_PORT;
app.set('port', process.env.PORT || HTTP_PORT);
function startHttpServer() {
    var server = false;
    server = http.createServer(app);
    server.listen(port, function () {
        console.log('Servidor web escuchando en el puerto ' + port);
    });
    return server;
}
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(workPath, "/public_html")));
app.get(ROOT_PATH, function(request, response) {
  return response.sendfile(workPath + "/public_html/index.html");
});

app.use(REST_ENDPOINT, ezequiel);
app.use(REST_ENDPOINT, getrouter);
app.use(REST_ENDPOINT,mateo);
app.use(REST_ENDPOINT,mauricio);


express.response.badRequest = function (args) {
    this.writeContinue();
    this.statusCode = 400;
    this.send(args);
    this.end();
}

express.response.sqlError = function (args) {
    this.writeContinue();
    this.statusCode = 503;
    this.send(args);
    this.end();
}

httpServer = startHttpServer();

