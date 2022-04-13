var express = require('express');
var http = require('http');
var app = express();
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync("./srv-config.json"));
var bodyParser = require('body-parser');
var registrar = require('./routers/registrar/registrar');
var cobrar = require('./routers/cobrar/cobrar');
var notifications = require('./routers/notifications/notifications');
var devolucion = require('./routers/devolucion/devolucion');
var ultimadevolucion = require('./routers/devolucion/ultimadevolucion');
var anular = require('./routers/anular/anular');
var cobrosnoregistrados = require('./routers/cobrar/cobrosnoregistrados');
var ultimocobro = require('./routers/cobrar/ultimocobro');
var sucursal = require('./routers/sucursal/sucursal');
var cobrosdecaja = require('./routers/cobrar/cobrosdecaja');
var test = require('./routers/test/test');
const pgDatabase = require('./DB');

const HTTP_PORT = conf.puerto;
const REST_mercadopago = "/:domain/";

let port = process.env.PORT || HTTP_PORT;

app.set('port', process.env.PORT || HTTP_PORT);
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(REST_mercadopago, sucursal);
app.use(REST_mercadopago, registrar);
app.use(REST_mercadopago, cobrar);
app.use(REST_mercadopago, notifications);
app.use(REST_mercadopago, devolucion);
app.use(REST_mercadopago, ultimadevolucion);
app.use(REST_mercadopago, anular);
app.use(REST_mercadopago, cobrosnoregistrados);
app.use(REST_mercadopago, ultimocobro);
app.use(REST_mercadopago, cobrosdecaja);
app.use(REST_mercadopago, test);

var dataBase = fs.readFileSync('./DB.sql').toString();
pgDatabase.query(dataBase, function (err, result) {
    done();
    if (err) {
        console.log('error: ', err);
        process.exit(1);
    }
    process.exit(0);
});

function startHttpServer() {
    var server = false;
    server = http.createServer(app);
    server.listen(port, function () {
        console.log('\nEl servidor esta corriendo en el puerto: ' + port + "\n");
    });
    return server;
};


express.response.badRequest = function (args) {
    this.writeContinue();
    this.statusCode = 400;
    this.send(args);
    this.end();
};

express.response.sqlError = function (args) {
    this.writeContinue();
    this.statusCode = 503;
    this.send(args);
    this.end();
};

httpServer = startHttpServer();