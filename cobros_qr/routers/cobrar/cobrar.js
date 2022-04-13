var express = require('express');
var router = express.Router({ mergeParams: true });
var request = require('request');
var pgDatabase = require('../../DB');
const path = '/cobrar/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');
const domains = conf.domains;

router.post(path, (req, res) => {

    var subdomain = req.params.domain;
    var token = req.query.token;
    var sucursalOk = false
    var cajaOk = false
    var tokenMP = '';
    var token_encontrado = false;
    var subD_encontrado = false;

    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error });
    }
    if (req.query['monto'] == undefined) {
        let error = "El monto no tiene un valor valido o no fue mandado como parametro."
        console.log(error);
        func.appendLogs(error);
        res.status(400).json({ error: error });
    }

    var sucursal = parseInt(req.query.sucursal);
    var caja = parseInt(req.query.caja);
    var monto = parseFloat(req.query.monto);
    var external_id = '';
    var pv = req.query.pv;
    var tipo = req.query.tipo;
    var numero = req.query.numero;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];
    tokenMP = arrayValidado[2];

    console.log("\n\n\n---Consultando cobrar.post---");
    func.appendLogs("---Consultando cobrar.post---");

    var querySucursal = "SELECT COUNT(*) AS sucursal FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
    // console.log(querySucursal);

    pgDatabase.query(querySucursal, req.query).then(function (columnSucursal) {

        // console.log(columnSucursal);

        if (columnSucursal[0].sucursal === '1') {

            sucursalOk = true

            var queryCaja = "SELECT COUNT(*) AS caja FROM cajas WHERE sucursal = " + sucursal + " AND caja = " + caja + " AND dominio = '" + subdomain + "'"
            // console.log(queryCaja);

            pgDatabase.query(queryCaja, req.query).then(function (columnCaja) {

                if (columnCaja[0].caja === '1') {

                    cajaOk = true

                }

                if (!cajaOk) {
                    let error = 'La caja no esta dada de alta.'
                    console.log(error);
                    func.appendLogs(error);
                    return res.status(400).json({ error: error })
                }

                if (token_encontrado && sucursalOk && cajaOk) {

                    var token_bruto = tokenMP
                    var token_en_array = token_bruto.split("-")

                    var n = token_en_array.length
                    var user_id = token_en_array[n - 1]


                    var queryInitial = "SELECT * FROM cobros WHERE sucursal = ${sucursal} AND caja = ${caja}";
                    func.appendLogs(queryInitial);
                    console.log("\n-Query: " + queryInitial);
                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


                    pgDatabase.query(queryInitial, req.query).then(function (dataCobros) {

                        queryPOST = "INSERT INTO cobros (sucursal, dominio, caja, pv, tipo, numero, okcaja, monto, estado) VALUES (" + "'" + sucursal + "'" + ", " + "'" + subdomain + "', " + "'" + caja + "', '" + pv + "', '" + tipo + "', '" + numero + "', 0, " + monto + ", ''); SELECT * FROM cobros ORDER BY external_id DESC LIMIT 1";
                        func.appendLogs(queryPOST);
                        console.log("\n-Query: " + queryPOST);
                        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                        pgDatabase.query(queryPOST, req.query).then(data => {

                            let result_ids = data[0];
                            ids = Object.values(result_ids);
                            external_id = ids[0];

                            var GET_SucursalId = "SELECT external_id FROM sucursales WHERE sucursal = '" + sucursal + "' AND dominio = '" + subdomain + "'";
                            func.appendLogs(GET_SucursalId);

                            pgDatabase.query(GET_SucursalId, req.query).then(data => {
                                let result_id_suc = data[0];
                                id = Object.values(result_id_suc);
                                id_sucursal = id[0];

                                var GET_CajaId = "SELECT external_id FROM cajas WHERE caja = " + caja + " AND sucursal = " + sucursal + " AND dominio = " + "'" + subdomain + "'";
                                func.appendLogs(GET_CajaId);

                                pgDatabase.query(GET_CajaId, req.query).then(data => {
                                    let result_id_caja = data[0];
                                    id = Object.values(result_id_caja);
                                    id_caja = id[0];

                                    var PUT_order = {
                                        'method': 'PUT',
                                        'url': 'https://api.mercadopago.com/instore/qr/seller/collectors/' + user_id + '/stores/' + id_sucursal + '/pos/' + id_caja + '/orders',
                                        'headers': {
                                            'Authorization': 'Bearer ' + '' + tokenMP + '',
                                            'Content-Type': 'application/json'
                                        },
                                        body: {
                                            "external_reference": '' + external_id + '',
                                            "title": "Compra " + external_id,
                                            "description": "",
                                            "notification_url": conf.url_ipn + subdomain + "/notifications/",
                                            "expiration_date": "2023-08-22T16:34:56.559-04:00",
                                            "total_amount": monto,
                                            "items": [
                                                {
                                                    "sku_number": "",
                                                    "category": "",
                                                    "title": "Compra " + external_id,
                                                    "description": "",
                                                    "unit_price": monto,
                                                    "quantity": 1,
                                                    "unit_measure": "unit",
                                                    "total_amount": monto
                                                }
                                            ],

                                            // "sponsor_id": 777691928
                                        },

                                        json: true

                                    };

                                    if (conf.sponsor_id != 0) {
                                        Object.defineProperty(PUT_order.body, "sponsor", {
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                            value: {
                                                "id": conf.sponsor_id
                                            }
                                        });

                                        console.log(PUT_order.body);
                                    }

                                    // console.log(PUT_order.body);
                                    console.log("\n-Registro de la Orden:");
                                    console.log(PUT_order);
                                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                    request(PUT_order, function (error, response) {
                                        if (error) throw new Error(error);

                                        console.log(response.statusCode);
                                        console.log(response.body);
                                        let body_order = response.body;
                                        func.appendLogs(body_order);

                                        console.log("\nResponse: ", external_id);
                                        func.appendLogs(external_id);

                                        return res.status(200).json({ external_id: external_id })
                                    });
                                })
                                    .catch(function (error) { return res.sqlError(error.message) });
                            })
                        })
                    })
                        .catch(function (error) { return res.sqlError(error.message) });
                }
            })

        }

        if (!token_encontrado) {
            let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
            console.log(error);
            func.appendLogs(error);
            return res.status(400).json({ error: error })
        }
        if (!sucursalOk) {
            let error = 'La sucursal no esta dada de alta.'
            console.log(error);
            func.appendLogs(error);
            return res.status(400).json({ error: error })
        }
    });
});


router.get(path, (req, res) => {


    var subdomain = req.params.domain;
    var token = req.query.token;
    var token_encontrado = false;
    var subD_encontrado = false;
    var sucursalOk = false;
    var cajaOk = false;


    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error });
    }
    if (req.query['external_id'] == undefined) {
        let error = "El external_id no tiene un valor valido o no fue mandado como parametro."
        console.log(error);
        func.appendLogs(error);
        res.status(400).json({ error: error });
    }

    var external_id = req.query.external_id
    var sucursal = parseInt(req.query.sucursal);
    var caja = parseInt(req.query.caja);
    var consultas = req.query.consultas;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];
    var tokenMP = arrayValidado[2];

    console.log('\n\n\n---Consultando cobros.get---');
    func.appendLogs('---Consultando cobros.get---');

    var querySucursal = "SELECT COUNT(*) AS sucursal FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
    // console.log(querySucursal);

    pgDatabase.query(querySucursal, req.query).then(function (columnSucursal) {

        // console.log(columnSucursal);

        if (columnSucursal[0].sucursal === '1') {

            sucursalOk = true

            var queryCaja = "SELECT COUNT(*) AS caja FROM cajas WHERE sucursal = " + sucursal + " AND caja = " + caja + " AND dominio = '" + subdomain + "'"
            // console.log(queryCaja);

            pgDatabase.query(queryCaja, req.query).then(function (columnCaja) {

                if (columnCaja[0].caja === '1') {

                    cajaOk = true

                }

                if (!cajaOk) {
                    let error = 'La caja no esta dada de alta.'
                    console.log(error);
                    func.appendLogs(error);
                    return res.status(400).json({ error: error })
                }
                // console.log("TOKEN: " + token);
                // console.log("QUERY: " + req.query);

                if (token_encontrado) {

                    if (consultas > 15) {

                        var GET_Notification = {
                            'method': 'GET',
                            'url': 'https://api.mercadopago.com/merchant_orders?external_reference=' + external_id,
                            'headers': {
                                'Authorization': 'Bearer ' + '' + tokenMP + ''
                            }
                        };

                        console.log("\n-GET a Mercado Pago ORDERS:");
                        console.log(GET_Notification);
                        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                        request(GET_Notification, (error, response) => {

                            if (error) throw new Error(error);

                            console.log(response.body);
                            console.log(response.statusCode);
                            console.log("ELEMENTS: ", JSON.parse(response.body).elements);

                            if (JSON.parse(response.body).elements === null) {

                                var queryInitial = "SELECT body, time, topic, id_mp, estado FROM cobros WHERE external_id = ${external_id}";
                                func.appendLogs(queryInitial);
                                console.log("\n-Query: " + queryInitial);
                                console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                                pgDatabase.query(queryInitial, req.query).then(function (data) {

                                    console.log("\nResponse: ", data);
                                    func.appendLogs(JSON.stringify(data));
                                    return res.status(200).send(data);

                                })

                            } else {


                                let body = JSON.parse(response.body).elements[0];
                                let id_mp = body.id
                                func.appendLogs(body);

                                queryPOST = "UPDATE cobros SET id_mp = " + id_mp + ", topic = 'merchant_order', time = CURRENT_TIMESTAMP, body = '" + JSON.stringify(body) + "' WHERE external_id = " + external_id;
                                func.appendLogs(queryPOST);
                                console.log("\n-Query: " + queryPOST);
                                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                pgDatabase.query(queryPOST, req.params).then(data => {

                                    var queryInitial = "SELECT body, time, topic, id_mp, estado FROM cobros WHERE external_id = ${external_id}";
                                    func.appendLogs(queryInitial);
                                    console.log("\n-Query: " + queryInitial);
                                    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                                    pgDatabase.query(queryInitial, req.query).then(function (data) {

                                        if (data[0].estado == 'cerrado') {

                                            if (external_id == 0) {
                                                var UPDATE_Cobros = "UPDATE cobros SET okcaja = 1 WHERE pv = {pv} AND tipo = {tipo} AND numero = {numero}"
                                            } else {

                                                var UPDATE_Cobros = "UPDATE cobros SET okcaja = 1 WHERE external_id = ${external_id}"
                                            }
                                            func.appendLogs(UPDATE_Cobros);

                                            pgDatabase.query(UPDATE_Cobros, req.query).then(() => {
                                                console.log("\n-Query: " + UPDATE_Cobros);
                                                console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                                            })
                                        }

                                        console.log("\nResponse: ", data);
                                        func.appendLogs(JSON.stringify(data));
                                        return res.status(200).send(data);

                                    })
                                        .catch(function (error) { return res.sqlError(error.message) });
                                })
                            }
                        });
                    }
                    else {

                        var Where = "WHERE external_id = ${external_id}";
                        if (external_id == 0) {
                            Where = "WHERE dominio = '" + subdomain + "' AND pv = ${pv} AND tipo = ${tipo} AND numero = ${numero}";
                        }

                        var queryInitial = "SELECT body, time, topic, id_mp, estado FROM cobros " + Where;
                        func.appendLogs(queryInitial);
                        console.log("\n-Query: " + queryInitial);
                        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                        pgDatabase.query(queryInitial, req.query).then(function (data) {

                            if (data.length == 0) {
                                let error = "No se encontro el cobro."
                                console.log(error);
                                func.appendLogs(error);
                                return res.status(400).json({ error: error });
                            }
                            else {

                                if (data[0].estado == 'cerrado') {
                                    console.log(external_id);

                                    if (external_id == 0) {
                                        var UPDATE_Cobros = "UPDATE cobros SET okcaja = 1 WHERE pv = ${pv} AND tipo = ${tipo} AND numero = ${numero}"
                                    } else {

                                        var UPDATE_Cobros = "UPDATE cobros SET okcaja = 1 WHERE external_id = ${external_id}"
                                    }
                                    func.appendLogs(UPDATE_Cobros);


                                    pgDatabase.query(UPDATE_Cobros, req.query).then(() => {
                                        console.log("\n-Query: " + UPDATE_Cobros);
                                        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                                    })
                                }

                                console.log("\nResponse: ", data);
                                func.appendLogs(JSON.stringify(data));

                                return res.status(200).send(data);
                            }
                        })
                            .catch(function (error) { return res.sqlError(error.message) });

                    }

                }
            })
        }

        if (!token_encontrado) {
            let error = subD_encontrado ? 'El token es incorrecto.' : 'El subdominio no pertenece a un cliente.';
            console.log(error);
            func.appendLogs(error);
            return res.status(400).json({ error: error })
        }
        if (!sucursalOk) {
            let error = 'La sucursal no esta dada de alta.'
            console.log(error);
            func.appendLogs(error);
            return res.status(400).json({ error: error })
        }
    });
});

module.exports = router;
