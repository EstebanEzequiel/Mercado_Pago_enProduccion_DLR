var express = require('express');
var router = express.Router({ mergeParams: true });
var path = '/anular/';
var fs = require('fs');
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var pgDatabase = require('../../DB');
var request = require('request');
var func = require('../../server-functions');
var domains = conf.domains;

router.post(path, (req, res) => {

    var subdomain = req.params.domain;
    var token = req.query.token;
    var tokenMP = ''
    var token_encontrado = false
    var subD_encontrado = false

    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        return res.status(400).json({ error: error });
    }
    if (req.query['external_id'] == undefined) {
        let error = "El external_id no tiene un valor valido o no fue mandado como parametro."
        console.log(error);
        res.status(400).json({ error: error });
    }

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];
    tokenMP = arrayValidado[2];

    console.log("\n\n\n---Consultando anular.post---");

    if (token_encontrado) {

        var token_bruto = tokenMP
        var token_en_array = token_bruto.split("-")

        var n = token_en_array.length
        var user_id = token_en_array[n - 1]

        var external_cobro_id = req.query.external_id

        var queryCajas = "SELECT * FROM cajas WHERE sucursal = " + req.query.sucursal + " AND caja = " + req.query.caja
        console.log("\n-Query: " + queryCajas);
        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

        pgDatabase.query(queryCajas, req.query).then(function (caja) {

            if (caja.length == 0) {
                let error = 'Los valores proporcionados de sucursal y/o caja no existen en la DB.'
                console.log(error);
                return res.status(400).json({ error: error })

            } else {

                var queryCobros = "SELECT * FROM cobros WHERE external_id = '" + external_cobro_id + "'"
                console.log("\n-Query: " + queryCobros);
                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                pgDatabase.query(queryCobros, req.query).then(function (cobro) {

                    if (cobro.length == 0) {

                        let error = 'No existe registro del pago consultado.';
                        console.log(error);
                        return res.status(400).json({ error: error })

                    } else {

                        var cancelledCobro = "SELECT cancelled FROM cobros WHERE external_id = " + external_cobro_id;

                        pgDatabase.query(cancelledCobro, req.query).then(cancelledData => {


                            console.log(cancelledData);

                            if (cancelledData[0].cancelled == null) {
                                
                                var post_id = caja[0].external_id
        
                                var order_canceled = {
        
                                    'method': 'DELETE',
                                    'url': 'https://api.mercadopago.com/instore/qr/seller/collectors/' + user_id + '/pos/' + post_id + '/orders',
                                    'headers': {
                                        'Authorization': 'Bearer ' + "'" + tokenMP + "'",
                                        'Cookie': '_d2id=e38bf0f3-1642-4e3c-8e2a-92fc4d18eda1-n'
                                    }
                                };
        
                                console.log("\n-Registro de la Anulacion de Orden:");
                                console.log(order_canceled);
                                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
        
        
                                request(order_canceled, function (error, response) {
        
                                    if (error) throw new Error(error);
        
                                    console.log(response.body);
                                    console.log(response.statusCode);
        
                                    if (response.body) {
        
                                        let error = "Error en anulacion. No se puede anular este cobro."
                                        // func.appendLogs(reponse.body.error);
                                        func.appendLogs(error);
                                        return res.status(400).json({ error: error })
        
                                    }
        
                                    queryCancelled = "UPDATE cobros SET cancelled = true WHERE external_id = " + external_cobro_id + ";"
        
                                    console.log("\n-Query: " + queryCancelled);
                                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
        
                                    pgDatabase.query(queryCancelled).then(() => {
                                        let response = 'Orden anulada.'
                                        console.log("\nResponse: Orden anulada.");
                                        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
        
                                        return res.status(200).json({ response: response });
                                    })
                                        .catch(function (error) { return res.sqlError(error.message) });
                                });
                            }
                            else{

                                let response = "El cobro ya fue anulado."
                                console.log(response);
                                return res.status(400).json({response: response})
                            }
                        })

                    }
                })
            }
        }).catch(function (error) { return res.sqlError(error.message) });

    }
    if (!token_encontrado) {
        let err = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
        console.log(err);
        return res.status(400).json({ err: err })
    }
});

module.exports = router;