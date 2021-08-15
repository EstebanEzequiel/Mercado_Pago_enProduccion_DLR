var express = require('express');
var router = express.Router({ mergeParams: true });
var path = '/sucursal/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var pgDatabase = require('../../DB');
var func = require('../../server-functions');
var domains = conf.domains;

router.post(path, async function (req, res) {

    var subdomain = req.params.domain;
    var sucursal = parseInt(req.query.sucursal)
    var token = req.query.token;
    var arrayValidado = [];
    var sucursalNoExist = true;

    var token_encontrado = false
    var subD_encontrado = false

    arrayValidado = func.dominioToken(domains, token, subdomain)
    subD_encontrado = arrayValidado[0]
    token_encontrado = arrayValidado[1]

    console.log("\n\n\n---Consultando sucursal.post---");
    func.appendLogs("\n\n\n---Consultando sucursal.post---");

    var primerQuery = "SELECT COUNT(*) AS sucursal FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"

    pgDatabase.query(primerQuery, req.query).then(function (responde) {

        if (responde[0].sucursal === '1' && token_encontrado) {

            sucursalNoExist = false
            let error = 'La sucursal ya existe en la base de datos.'
            console.log('\n' + error);
            func.appendLogs(error);
            return res.status(400).json({ error: error })
        }

        if (!token_encontrado) {

            let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio es incorrecto.';
            console.log('\n' + error);
            func.appendLogs(error);
            return res.status(400).json({ error: error })
        }


        if (token_encontrado && sucursalNoExist) {

            var sucursal = req.query.sucursal
            var nombre = req.query.nombre
            var ciudad = req.query.ciudad
            var provincia = req.query.provincia
            var latitud = req.query.latitud
            var longitud = req.query.longitud
            var calle = req.query.calle
            var numero = req.query.numero

            var queryInsertar = "INSERT INTO sucursales (sucursal, nombre, dominio, ciudad, provincia, latitud, longitud, calle, numero) VALUES ('" + sucursal + "', '" + nombre + "', '" + subdomain + "', '" + ciudad + "', '" + provincia + "', '" + latitud + "', '" + longitud + "', '" + calle + "', '" + numero + "')";
            func.appendLogs(queryInsertar);
            console.log("\n-Query: " + queryInsertar);
            console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


            pgDatabase.query(queryInsertar).then(() => {

                let response = 'La sucursal fue registrada existosamente.'
                console.log('\nResponse: ' + response);
                func.appendLogs(response);
                return res.status(200).json({ response: response });
            })
                .catch(function (error) { return res.sqlError(error.message) });
        }
    })
        .catch(function (error) { return res.sqlError(error.message) });
})

module.exports = router;
