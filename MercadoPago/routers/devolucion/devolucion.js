var express = require('express');
var router = express.Router({ mergeParams: true });
var request = require('request');
var pgDatabase = require('../../DB');
const path = '/devolucion/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var func = require('../../server-functions');


const domains = conf.domains;

router.post(path, (req, res) => {

    var subdomain = req.params.domain;
    var token = req.query.token;
    var tokenMP = '';
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

    var sucursal = parseInt(req.query.sucursal);
    var caja = parseInt(req.query.caja);
    var id_cobro = (req.query.external_id);
    var pv = req.query.pv;
    var tipo = req.query.tipo;
    var numero = req.query.numero;
    var monto = parseFloat(req.query.monto);
    var estado = '';

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];
    tokenMP = arrayValidado[2];

    console.log("\n\n\n---Consultando devolucion.post---");
    func.appendLogs("\n\n\n---Consultando devolucion.post---");

    var querySucursal = "SELECT COUNT(*) AS sucursal FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
    // console.log(querySucursal);

    pgDatabase.query(querySucursal, req.query).then(function (columnSucursal) {

        // console.log(columnSucursal);

        if (columnSucursal[0].sucursal === '1') {

            sucursalOk = true

            var queryCaja = "SELECT COUNT(*) AS caja FROM cajas WHERE sucursal = " + sucursal + " AND caja = " + caja + " AND dominio = '" + subdomain + "'"
            // console.log(queryCaja);

            pgDatabase.query(queryCaja, req.query).then(function (columnCaja) {

                // console.log(columnCaja);

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

                    let cWhere = "WHERE c.sucursal = ${sucursal} AND c.caja = ${caja} AND dominio = '" + subdomain + "' AND c.external_id = " + id_cobro;
                    if (id_cobro == 0) {
                        cWhere = "WHERE c.sucursal = ${sucursal} AND c.caja = ${caja} AND dominio = '" + subdomain + "' AND c.pv = " + pv + " AND c.tipo = " + tipo + " AND c.numero = " + numero;
                    }

                    // var queryInitial = "SELECT * FROM cobros WHERE (dominio = " + "'" + subdomain + "'" + " AND sucursal = ${sucursal} AND caja = ${caja} AND external_id = ${external_id }) OR (dominio = '" + subdomain + "' AND sucursal = ${sucursal} AND caja = ${caja} AND pv = ${pv} AND tipo = ${tipo} AND numero = ${numero})";
                    var queryInitial = "SELECT p.*, p.body -> 'status' as estado FROM payments p LEFT JOIN cobros c ON p.external_id = c.external_id " + cWhere;
                    func.appendLogs(queryInitial);

                    console.log("\n-Query: " + queryInitial);
                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                    pgDatabase.query(queryInitial, req.query).then(function (dataDev) {
                        console.log(dataDev);
                        let montoDesc = dataDev[0].body.transaction_details.total_paid_amount;
                        let cupon = dataDev[0].body.coupon_amount;

                        console.log(montoDesc);
                        console.log(cupon);

                        if (dataDev.length === 0) {
                            let error = 'El cobro no esta registrado como pagado en Mercado Pago.'
                            func.appendLogs(dataDev);
                            func.appendLogs(error);
                            return res.status(400).json({ error: error })

                        }

                        pagoAprobado = null;

                        for (i = 0; i < dataDev.length; i++) {

                            if (dataDev[i].estado == 'approved') {
                                pagoAprobado = dataDev[i];
                            }

                        }

                        if (pagoAprobado != null) {

                            let montoPayment = parseFloat(pagoAprobado.monto);
                            //console.log(req.query);
                            console.log(montoPayment);
                            console.log(monto);
                            
                            if (montoPayment < monto) {
                                let error = "El monto proporcionado es mayor al pago realizado."
                                console.log(error);
                                func.appendLogs(error);
                                return res.status(400).json({ error: error })
                            }

                            if (cupon != 0 && montoPayment != monto) {
                                
                                let error = "No se pueden realizar devoluciones parciales sobre pagos con descuentos."
                                console.log(error);
                                return res.status(400).json({error: error})
                            }

                            if (montoPayment === monto) {
                                monto = montoDesc;
                            }

                            id_cobro = parseInt(pagoAprobado.external_id)
                            let id_payments = parseInt(pagoAprobado.id_payments);
                            // console.log(id_payments);
                            // console.log(id_cobro);


                            //https://api.mercadopago.com/v1/advanced_payments/' + id_payments + '/refunds
                            //https://api.mercadopago.com/v1/payments/' + id_payments + '/refunds
                            var DEV = {
                                'method': 'POST',
                                'url': 'https://api.mercadopago.com/v1/payments/' + id_payments + '/refunds',
                                'headers': {
                                    'Authorization': 'Bearer ' + '' + tokenMP + '',
                                    'Content-Type': 'application/json'
                                },
                                body: {
                                    "amount": monto
                                },

                                json: true
                            };

                            console.log("\n-Registro de la Devolucion:");
                            console.log(DEV);
                            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


                            request(DEV, (error, response) => {
                                if (error) console.log(error);
                                console.log(response.body);
                                console.log(response.statusCode);
                                let body_dev = response.body;
                                // console.log(body_dev);


                                func.appendLogs(body_dev);
                                func.appendLogs(response.statusCode);

                                console.log(response.body.error);
                                if (response.body.error) {

                                    let error = "Error al registrar la devolucion en Mercado Pago."
                                    // func.appendLogs(reponse.body.error);
                                    func.appendLogs(error);
                                    return res.status(400).json({ error: error })

                                }

                                let id_mp = body_dev.id;
                                let status = body_dev.status;
                                //console.log(id_mp);
                                //console.log(status);

                                if (status === 'approved') {
                                    estado = 'cerrado';
                                }

                                var queryPOST = "INSERT INTO devoluciones (sucursal, dominio, caja, id_cobro, id_payments, fecha, body, monto, id_mp, estado) VALUES (" + "'" + sucursal + "'" + ", " + "'" + subdomain + "', " + "'" + caja + "', " + "'" + id_cobro + "'" + ", " + id_payments + ", CURRENT_TIMESTAMP, '" + JSON.stringify(body_dev) + "', " + monto + ", " + id_mp + ", '" + estado + "'); SELECT id_dev FROM devoluciones ORDER BY id_dev DESC LIMIT 1";
                                console.log("\n-Query: " + queryPOST);
                                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
                                func.appendLogs(queryPOST);

                                pgDatabase.query(queryPOST, req.query).then(data => {

                                    let result_ids = data[0];
                                    ids = Object.values(result_ids);
                                    let id_dev = ids[0];

                                    var DevInCobro = "UPDATE cobros SET devolucion = " + id_dev + " WHERE external_id = " + id_cobro;
                                    console.log("\n-Query: " + DevInCobro);
                                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                    func.appendLogs(DevInCobro);

                                    pgDatabase.query(DevInCobro, req.query).then(data => {

                                        var querySelectDEV = "SELECT *, body AS body_dev, id_dev AS external_id_dev FROM devoluciones WHERE id_dev = " + id_dev;
                                        console.log("\n-Query: " + querySelectDEV);
                                        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                        pgDatabase.query(querySelectDEV, req.query).then(DevData => {

                                            console.log(DevData);

                                            console.log("\nResponse: " + JSON.stringify(DevData[0]));
                                            console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");
                                            func.appendLogs(DEV[0]);
                                            return res.status(200).send(DevData[0])

                                        })
                                    })
                                })
                            })
                        } else {
                            let error = 'No se encontro un pago aprobado o ya fue devuelto.'
                            console.log(error);
                            func.appendLogs("Pago Aprobado: " + pagoAprobado);
                            func.appendLogs(error);
                            return res.status(400).json({ error: error })
                        }
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

    // arrayValidado1 = logger.dirname();
    // console.log(arrayValidado1);

    var subdomain = req.params.domain;
    var token = req.query.token;
    var token_encontrado = false;
    var subD_encontrado = false;
    var external_id = req.query.external_id;

    var arrayValidado = [];

    arrayValidado = func.dominioToken(domains, token, subdomain);
    subD_encontrado = arrayValidado[0];
    token_encontrado = arrayValidado[1];

    console.log('\n\n\n---Consultando devolucion.get---');
    func.appendLogs('\n\n\n---Consultando devolucion.get---');

    if (token_encontrado) {

        let dWhere = "WHERE c.external_id = ${external_id}";
        if (external_id == 0) {
            dWhere = "WHERE c.dominio = '" + subdomain + "' AND c.pv = ${pv} AND c.tipo = ${tipo} AND c.numero = ${numero}";
        }

        var queryInitial = "SELECT d.* FROM devoluciones d LEFT JOIN cobros c ON d.id_cobro = c.external_id " + dWhere;
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

                func.appendLogs(dataDev);
                return res.status(200).send(dataDev);
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
