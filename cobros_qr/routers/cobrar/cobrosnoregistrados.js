var express = require('express');
var router = express.Router({ mergeParams: true });
var pgDatabase = require('../../DB');
const path = '/cobrosnoregistrados/';
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

  var pv = req.query.pv
  var consultas = req.query.consultas;

  var arrayValidado = [];

  arrayValidado = func.dominioToken(domains, token, subdomain);
  subD_encontrado = arrayValidado[0];
  token_encontrado = arrayValidado[1];


  console.log('\n\n\n---Consultando cobros.get---');
  func.appendLogs('\n\n\n---Consultando cobros.get---');


  //var queryInitial = "SELECT *, body -> 'total_amount' AS monto FROM cobros WHERE id_mp IS NOT null AND okcaja = 0 AND pv = " + pv;
  var queryInitial = "SELECT *, body -> 'total_amount' AS monto FROM cobros, LATERAL (SELECT string_agg(value::text, ', ') AS payments FROM json_array_elements_text(body->'payments')) payment WHERE id_mp IS NOT null AND okcaja = 0 AND payments IS NOT null AND pv = " + pv;
  func.appendLogs(queryInitial);
  console.log("\n-Query: " + queryInitial);
  console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


  pgDatabase.query(queryInitial, req.query).then(function (data) {

    // console.log(data);

    func.appendLogs("\nResponse: " + data);
    console.log("\nResponse: ", data);
    return res.status(200).send(data);

  });

  if (!token_encontrado) {
    let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
    console.log(error);
    func.appendLogs(error);

    return res.status(400).json({ error: error })
  }

});

module.exports = router;
