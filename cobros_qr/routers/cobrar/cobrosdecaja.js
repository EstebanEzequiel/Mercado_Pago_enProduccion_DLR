var express = require('express');
var router = express.Router({ mergeParams: true });
var pgDatabase = require('../../DB');
const path = '/cobrosdecaja/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const domains = conf.domains;


router.get(path, (req, res) => {

  var subdomain = req.params.domain;
  var token = req.query.token;
  var token_encontrado = false;
  var subD_encontrado = false;

  if (req.query['pv'] == undefined) {
    let error = "El punto de venta no tiene un valor valido o no fue mandado como parametro."
    console.log(error);
    func.appendLogs(error);
    res.status(400).json({ error: error });
  }

  var pv = req.query.pv;
  var fecha = req.query.fecha;
  var split = fecha.split('-');
  console.log(split);
  var fechaPosterior = ((parseInt(split[0]) + 1) + '-' + split[1] + '-' + split[2]);


  var arrayValidado = [];

  arrayValidado = func.dominioToken(domains, token, subdomain);
  subD_encontrado = arrayValidado[0];
  token_encontrado = arrayValidado[1];


  console.log('\n\n\n---Consultando cobros.get---');
  func.appendLogs('\n\n\n---Consultando cobros.get---');

  if (pv === '0') {

    var queryCobrosTotales = "SELECT * FROM cobros WHERE dominio = '" + subdomain + "' AND time BETWEEN '" + fecha + "' AND '" + fechaPosterior + "'";
    func.appendLogs(queryCobrosTotales);
    console.log("\n-Query: " + queryCobrosTotales);
    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


    pgDatabase.query(queryCobrosTotales, req.query).then(function (data) {

      func.appendLogs("\nResponse: " + data);
      console.log("\nResponse: ", data);
      return res.status(200).send(data);
    })
  }
  else {

    var queryInitial = "SELECT * FROM cobros WHERE pv = " + pv + " AND dominio = '" + subdomain + "' AND time BETWEEN '" + fecha + "' AND '" + fechaPosterior + "'";
    func.appendLogs(queryInitial);
    console.log("\n-Query: " + queryInitial);
    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


    pgDatabase.query(queryInitial, req.query).then(function (data) {

      // console.log(data);

      func.appendLogs("\nResponse: " + data);
      console.log("\nResponse: ", data);
      return res.status(200).send(data);

    });
  }



  if (!token_encontrado) {
    let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
    console.log(error);
    func.appendLogs(error);

    return res.status(400).json({ error: error })
  }

});

module.exports = router;
