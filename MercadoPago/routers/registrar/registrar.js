var express = require('express');
var router = express.Router({ mergeParams: true });
var path = '/registrar/';
var fs = require("fs");
var conf = JSON.parse(fs.readFileSync('./srv-config.json'));
var pgDatabase = require('../../DB');
var func = require('../../server-functions');
var funcReg = require('./registrar-func')
var domains = conf.domains;

router.post(path, async function (req, res) {

    var subdomain = req.params.domain;
    var token = req.query.token;
    var tokenMP = '';
    var arrayValidado = [];
    var arraySucursal = [];
    var arrayCaja = [];

    var token_encontrado = false
    var subD_encontrado = false
    var sucursalOk = false

    if (((req.query['sucursal'] == undefined) && (req.query['caja'] == undefined)) || ((req.query['sucursal'] == undefined)) || ((req.query['caja'] == undefined))) {
        let error = "Sucursal y/o caja no tienen valores validos o no fueron mandados como parametros."
        console.log(error);
        func.appendLogs(error);
        return res.status(400).json({ error: error });
    }

    var sucursal = parseInt(req.query.sucursal)
    var nro_caja = parseInt(req.query.caja)

    arrayValidado = func.dominioToken(domains, token, subdomain)
    subD_encontrado = arrayValidado[0]
    token_encontrado = arrayValidado[1]

    console.log("\n\n\n---Consultando registrar.post---");
    func.appendLogs("\n\n\n---Consultando registrar.post---");

    var primerQuery = "SELECT COUNT(*) AS sucursal FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"

    pgDatabase.query(primerQuery, req.query).then(function (columnSucursal) {

        if (columnSucursal[0].sucursal == '1') {

            sucursalOk = true
        }

        if (token_encontrado && sucursalOk) {

            tokenMP = arrayValidado[2]
            var token_bruto = tokenMP
            var token_en_array = token_bruto.split("-")

            var n = token_en_array.length
            var user_id = token_en_array[n - 1]

            var external_id_store = subdomain + (sucursal + '').padStart(4, '0');
            var medio_pos_id = (nro_caja + '').padStart(4, '0')
            var external_id_pos = external_id_store + medio_pos_id

            var queryValidarSucursal = "SELECT * FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
            console.log("\n-Query: " + queryValidarSucursal);
            console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

            pgDatabase.query(queryValidarSucursal, req.query).then(function (sucursalConsultada) {
                console.log(sucursalConsultada);
                if (sucursalConsultada[0].id_mp === null || sucursalConsultada[0].id_mp === 0) {

                    // console.log(external_id_store);

                    var queryIdStore = "UPDATE sucursales SET external_id = '" + external_id_store + "' WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "';"
                    func.appendLogs(queryIdStore);

                    console.log("\n-Query: " + queryIdStore);
                    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                    pgDatabase.query(queryIdStore, req.query).then(function () {

                        var querySucursal = "SELECT * FROM sucursales WHERE sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
                        func.appendLogs(querySucursal);

                        console.log("\n-Query: " + querySucursal);
                        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                        pgDatabase.query(querySucursal, req.query).then(async function (sucursales) {

                            // console.log(sucursales[0].dominio);

                            try {

                                var id_mp_suc = await funcReg.asyncSucursal(sucursales, user_id, tokenMP, external_id_store);

                            } catch (error) {
                                return res.status(400).json({ error: error })
                            }

                            console.log("FUNCION SUC INI");
                            console.log(id_mp_suc);
                            console.log("FUNCION SUC FIN");

                            // console.log(id_mp_suc);

                            queryUPDATESucursal = "UPDATE sucursales SET id_mp = " + id_mp_suc + " WHERE external_id = '" + external_id_store + "'";
                            func.appendLogs(queryUPDATESucursal);

                            console.log("\n-Query: " + queryUPDATESucursal);
                            console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                            pgDatabase.query(queryUPDATESucursal).then(() => {

                                var queryBuscarCaja = "SELECT * FROM cajas WHERE caja = " + nro_caja + ""
                                func.appendLogs(queryBuscarCaja);

                                console.log("\n-Query: " + queryBuscarCaja);
                                console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                                pgDatabase.query(queryBuscarCaja, req.query).then(async function (caja) {

                                    try {

                                        arrayCaja = await funcReg.asyncCaja(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos);
                                        // console.log(arrayCaja);

                                    } catch (error) {
                                        return res.status(400).json({ error: error })
                                    }

                                    var id_mp_pos = arrayCaja[0];
                                    var qr = arrayCaja[1];

                                    console.log("FUNCION POS INI");
                                    console.log(id_mp_pos);
                                    console.log(qr);
                                    console.log("FUNCION POS FIN");

                                    var queryBuscarCaja = "SELECT * FROM cajas WHERE caja = " + nro_caja + " AND sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
                                    func.appendLogs(queryBuscarCaja);

                                    console.log("\n-Query: " + queryBuscarCaja);
                                    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                                    pgDatabase.query(queryBuscarCaja, req.query).then(function (caja) {

                                        if (caja.length == 0) {

                                            queryCaja = "INSERT INTO cajas (sucursal, dominio, caja, qr, id_mp, external_id) VALUES ('" + sucursal + "', '" + subdomain + "', '" + nro_caja + "', '" + qr + "', '" + id_mp_pos + "', '" + external_id_pos + "')";
                                            func.appendLogs(queryCaja);
                                            console.log("\n-Query: " + queryCaja);
                                            console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                                            pgDatabase.query(queryCaja).then(() => {

                                                func.appendLogs("\nResponse: " + qr);

                                                console.log("\nResponse: ", qr);
                                                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");

                                                return res.status(200).json({ qr: qr });

                                            })
                                                .catch(function (error) { return res.sqlError(error.message) });
                                        } else {

                                            var queryQr = "SELECT qr FROM cajas WHERE caja = '" + nro_caja + "' AND sucursal = '" + sucursal + "' AND dominio = '" + subdomain + "'";
                                            func.appendLogs(queryQr);
                                            console.log("\n-Query: " + queryQr);
                                            console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


                                            pgDatabase.query(queryQr).then(response => {

                                                // console.log(response[0]);

                                                let qr_code = Object.values(response[0])
                                                let qr = qr_code[0]

                                                // console.log(qr);

                                                func.appendLogs("\nResponse: " + qr);
                                                console.log("\nResponse: ", qr);
                                                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


                                                return res.status(200).json({ qr: qr });

                                            })
                                                .catch(function (error) { return res.sqlError(error.message) });
                                        }
                                    })
                                });
                            })
                                .catch(function (error) { return res.sqlError(error.message) });
                        })
                    })

                } else {

                    var queryBuscarCaja = "SELECT * FROM cajas WHERE caja = " + nro_caja + " AND sucursal = " + sucursal + " AND dominio = '" + subdomain + "'"
                    func.appendLogs(queryBuscarCaja);
                    console.log("\n-Query: " + queryBuscarCaja);
                    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

                    pgDatabase.query(queryBuscarCaja, req.query).then(function (caja) {

                        if (caja.length == 0) {

                            // console.log('** La sucursal esta dada de alta **\n');

                            var buscarStore = "SELECT id_mp FROM sucursales WHERE sucursal = ${sucursal} AND dominio = '" + subdomain + "'";
                            func.appendLogs(buscarStore);

                            pgDatabase.query(buscarStore, req.query).then(async function (dataStore) {

                                console.log(dataStore);
                                let id_mp_suc = dataStore[0].id_mp

                                try {

                                    arrayCaja = await funcReg.asyncCaja(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos);
                                    // console.log(arrayCaja);

                                } catch (error) {
                                    return res.status(400).json({ error: error })
                                }

                                var id_mp_pos = arrayCaja[0];
                                var qr = arrayCaja[1];

                                console.log("FUNCION POS INI");
                                console.log(id_mp_pos);
                                console.log(qr);
                                console.log("FUNCION POS FIN");

                                queryCaja = "INSERT INTO cajas (sucursal, dominio, caja, qr, id_mp, external_id) VALUES ('" + sucursal + "', '" + subdomain + "', '" + nro_caja + "', '" + qr + "', '" + id_mp_pos + "', '" + external_id_pos + "')";
                                func.appendLogs(queryCaja)

                                console.log("\n-Query: " + queryCaja);
                                console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


                                pgDatabase.query(queryCaja).then(() => {

                                    func.appendLogs("\nResponse: " + qr)

                                    console.log("\nResponse: ", qr);
                                    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


                                    return res.status(200).json({ qr: qr });

                                })
                                    .catch(function (error) { return res.sqlError(error.message) });


                            })

                        } else {

                            var queryQr = "SELECT qr FROM cajas WHERE caja = '" + nro_caja + "' AND sucursal = '" + sucursal + "' AND dominio = '" + subdomain + "'";
                            func.appendLogs(queryQr);
                            console.log("\n-Query: " + queryQr);
                            console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


                            pgDatabase.query(queryQr).then(response => {

                                // console.log(response[0]);

                                let qr_code = Object.values(response[0])
                                let qr = qr_code[0]

                                // console.log(qr);

                                func.appendLogs("\nResponse: " + qr);

                                console.log("\nResponse: ", qr);
                                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------");


                                return res.status(200).json({ qr: qr });

                            })
                                .catch(function (error) { return res.sqlError(error.message) });
                        }
                    })
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
    })
});


module.exports = router;