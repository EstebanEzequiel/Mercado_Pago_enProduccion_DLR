var express = require('express');
var router = express.Router({ mergeParams: true });
var pgDatabase = require('../../DB');
const path = '/ultimocobro/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const domains = conf.domains;


router.get(path, (req, res) => {

    var subdomain = req.params.domain;
    var token = req.query.token;
    var token_encontrado = false;
    var subD_encontrado = false;

    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error });
    }

    var sucursal = req.query.sucursal;
    var caja = req.query.caja;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];


    console.log('\n\n\n---Consultando cobros.get---');
    func.appendLogs('\n\n\n---Consultando cobros.get---');


    var queryInitial = "SELECT * FROM cobros WHERE dominio = '" + subdomain + "' AND caja = " + caja + " AND sucursal = " + sucursal + " ORDER BY external_id DESC LIMIT 1";
    func.appendLogs(queryInitial);
    console.log("\n-Query: " + queryInitial);
    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


    pgDatabase.query(queryInitial, req.query).then(function (data) {
        
        func.appendLogs("\nResponse: " + data);
        console.log("\nResponse: ", data);
        return res.status(200).send(data[0]);

    });

    if (!token_encontrado) {
        let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
        console.log(error);
        func.appendLogs(error);

        return res.status(400).json({ error: error })
    }

});

module.exports = router;
