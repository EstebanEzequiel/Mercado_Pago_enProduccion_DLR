var express = require('express');
var router = express.Router({ mergeParams: true });
var request = require('request');
var pgDatabase = require('../../DB');
const path = '/notifications/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const domains = conf.domains;

router.post(path, (req, res) => {

    var subdomain = req.params.domain;
    var subD_encontrado = false;
    var tokenMP = '';
    var estado = '';

    console.log("\n\n\n---Consultando notifications.post---");
    func.appendLogs("\n\n\n---Consultando notifications.post---");

    for (let element of domains) {

        if (subdomain === element.domain) {
            subD_encontrado = true
            tokenMP = element.tokenMP
        }
    }

    if (subD_encontrado) {

        let campos = [req.query];
        console.log(campos);
        var valores_campos = Object.values(campos[0]);
        var id_order = valores_campos[0];
        var topic = valores_campos[1];


        if (valores_campos[1] === 'payment') {

            topic = "merchant_order"

            var GET_IdPayment = {
                'method': 'GET',
                'url': 'https://api.mercadopago.com/v1/payments/' + id_order,
                'headers': {
                    'Authorization': 'Bearer ' + '' + tokenMP + ''
                }
            };

            console.log("\n-GET a Mercado Pago PAYMENTS:");
            console.log(GET_IdPayment);
            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

            request(GET_IdPayment, (error, response) => {
                console.log(response.body);
                console.log(response.statusCode);
                if (error) console.log(error);
                console.log(JSON.parse(response.body).error);
                if (JSON.parse(response.body).error) {

                    let error = "\nError al obtener la compra de Mercado Pago."
                    // func.appendLogs(reponse.body.error);
                    console.log(error);
                    func.appendLogs(error);
                    return res.status(400).json({ error: error })

                }
                id_order = JSON.parse(response.body).order.id;
                let body_payments = response.body;
                func.appendLogs(body_payments)
                let id_payments = JSON.parse(response.body).id;
                let monto = JSON.parse(response.body).transaction_amount;
                let external_id = parseInt(JSON.parse(response.body).external_reference);
                // console.log(id_order);

                var queryPaymentsLength = "SELECT * FROM payments WHERE id_payments = " + id_payments;

                console.log("\n-Query: " + queryPaymentsLength);
                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                pgDatabase.query(queryPaymentsLength, req.query).then(function (dataPayments) {

                    // console.log(dataPayments);
                    if (dataPayments.length === 0) {

                        var queryPayments = "INSERT INTO payments (id_payments, id_order, external_id, body, monto, time) VALUES (" + id_payments + ", " + id_order + ", " + external_id + ", '" + body_payments + "', " + monto + ", CURRENT_TIMESTAMP);"
                        console.log("\n-Query: " + queryPayments);
                        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                        pgDatabase.query(queryPayments, req.query).then(function (dataPayments) {

                            var queryInitial = "SELECT * FROM cobros WHERE id_mp = " + id_order + " AND topic = " + "'" + topic + "'";
                            console.log("\n-Query: " + queryInitial);
                            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                            pgDatabase.query(queryInitial, req.query).then(function (dataNotifications) {
                                // console.log(dataNotifications);

                                var GET_ExternalId = {
                                    'method': 'GET',
                                    'url': 'https://api.mercadopago.com/merchant_orders/' + id_order,
                                    'headers': {
                                        'Authorization': 'Bearer ' + '' + tokenMP + ''
                                    }
                                };

                                console.log("\n-GET a Mercado Pago ORDERS:");
                                console.log(GET_ExternalId);
                                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                request(GET_ExternalId, (error, response) => {
                                    // console.log(response.body);
                                    // console.log(response.statusCode);
                                    if (error) throw new Error(error);
                                    let external_id = JSON.parse(response.body).external_reference;
                                    let status = JSON.parse(response.body).status;
                                    let order_status = JSON.parse(response.body).order_status;
                                    let body = response.body;

                                    func.appendLogs(body);

                                    if (status === 'closed' && order_status === 'paid') {
                                        estado = "cerrado";
                                    }

                                    queryPOST = "UPDATE cobros SET id_mp = " + id_order + ", topic = '" + topic + "', time = CURRENT_TIMESTAMP, body = '" + body + "', estado = '" + estado + "' WHERE external_id = " + external_id;

                                    console.log("\n-Query: " + queryPOST);
                                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                    pgDatabase.query(queryPOST, req.params).then(data => {

                                        return res.status(200).json();
                                    })
                                });
                            })
                        })
                    }
                    else {

                        var UPDATE_Payments = "UPDATE payments SET body = '" + body_payments + "', monto = " + monto + ", time = CURRENT_TIMESTAMP WHERE id_payments = " + id_payments;

                        console.log("\n-Query: " + UPDATE_Payments);
                        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


                        pgDatabase.query(UPDATE_Payments, req.query).then(function (DataUpdatePAY) {

                            console.log("El payment fue actualizado exitosamente.");
                            // console.log(DataUpdatePAY);

                            var queryInitial = "SELECT * FROM cobros WHERE id_mp = " + id_order + " AND topic = " + "'" + topic + "'";
                            console.log("\n-Query: " + queryInitial);
                            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                            pgDatabase.query(queryInitial, req.query).then(function (dataNotifications) {
                                // console.log(dataNotifications);

                                var GET_ExternalId = {
                                    'method': 'GET',
                                    'url': 'https://api.mercadopago.com/merchant_orders/' + id_order,
                                    'headers': {
                                        'Authorization': 'Bearer ' + '' + tokenMP + ''
                                    }
                                };

                                console.log("\n-GET a Mercado Pago ORDERS:");
                                console.log(GET_ExternalId);
                                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                request(GET_ExternalId, (error, response) => {
                                    // console.log(response.body);
                                    // console.log(response.statusCode);
                                    if (error) throw new Error(error);
                                    let external_id = JSON.parse(response.body).external_reference;
                                    let status = JSON.parse(response.body).status;
                                    let order_status = JSON.parse(response.body).order_status;
                                    let body = response.body;
                                    func.appendLogs(body);

                                    if (status === 'closed' && order_status === 'paid') {
                                        estado = "cerrado";
                                    }

                                    queryPOST = "UPDATE cobros SET id_mp = " + id_order + ", topic = '" + topic + "', time = CURRENT_TIMESTAMP, body = '" + body + "', estado = '" + estado + "' WHERE external_id = " + external_id;

                                    console.log("\n-Query: " + queryPOST);
                                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                    pgDatabase.query(queryPOST, req.params).then(data => {

                                        return res.status(200).json();
                                    })
                                });
                            })
                        })
                    }
                })
            });
        }
        else {

            var queryInitial = "SELECT * FROM cobros WHERE id_mp = " + id_order + " AND topic = " + "'" + topic + "'";
            console.log("\n-Query: " + queryInitial);
            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

            pgDatabase.query(queryInitial, req.query).then(function (dataNotifications) {
                // console.log(dataNotifications);

                var GET_ExternalId = {
                    'method': 'GET',
                    'url': 'https://api.mercadopago.com/merchant_orders/' + id_order,
                    'headers': {
                        'Authorization': 'Bearer ' + '' + tokenMP + ''
                    }
                };

                console.log("\n-GET a Mercado Pago:");
                console.log(GET_ExternalId);
                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                request(GET_ExternalId, (error, response) => {
                    // console.log(response.body);
                    // console.log(response.statusCode);
                    if (error) throw new Error(error);
                    let external_id = JSON.parse(response.body).external_reference;
                    let body = response.body;
                    func.appendLogs(body)

                    queryPOST = "UPDATE cobros SET id_mp = " + id_order + ", topic = '" + topic + "', time = CURRENT_TIMESTAMP, body = '" + body + "'WHERE external_id = " + external_id;

                    console.log("\n-Query: " + queryPOST);
                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                    pgDatabase.query(queryPOST, req.params).then(data => {

                        return res.status(200).json();
                    })
                });

            })
        }
        // .catch(function (error) { return res.sqlError(error.message) })
    }
    if (!subD_encontrado) {
        let error = 'El subdominio no pertenece a un cliente.';
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error })
    }
});

module.exports = router;
