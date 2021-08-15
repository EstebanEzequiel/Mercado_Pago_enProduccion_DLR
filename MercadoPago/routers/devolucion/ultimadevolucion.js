var express = require('express');
var router = express.Router({ mergeParams: true });
var request = require('request');
var pgDatabase = require('../../DB');
const path = '/ultimadevolucion/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');

const domains = conf.domains;


router.get(path, (req, res) => {

    // arrayValidado1 = logger.dirname();
    // console.log(arrayValidado1);

    var subdomain = req.params.domain;
    var token = req.query.token;
    var token_encontrado = false;
    var subD_encontrado = false;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];

    console.log('\n\n\n---Consultando devolucion.get---');
    func.appendLogs('\n\n\n---Consultando devolucion.get---');

    if (token_encontrado) {

        var queryInitial = "SELECT d.* FROM devoluciones d LEFT JOIN cobros c ON d.id_cobro = c.external_id WHERE c.dominio = '" + subdomain + "' AND c.caja = ${caja} AND c.sucursal = ${sucursal} ORDER BY d.id_cobro DESC LIMIT 1 ";
        // var queryInitial = "SELECT * FROM devoluciones WHERE id_cobro = ${id_cobro} AND id_dev = ${id_dev} AND dominio = " + "'" + subdomain + "'";
        console.log("\n-Query: " + queryInitial);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");
        func.appendLogs(queryInitial);

        pgDatabase.query(queryInitial, req.query).then(function (dataDev) {
            if (dataDev.length == 0) {

                let error = "La devolucion no existe."
                return res.status(400).json({ error: error })

            }
            else {

                console.log("\nResponse: ", dataDev);

                func.appendLogs(dataDev);
                return res.status(200).send(dataDev[0]);
            }

        })
            .catch(function (error) { return res.sqlError(error.message) });
    }
    if (!token_encontrado) {
        let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error })
    }
});

module.exports = router;
