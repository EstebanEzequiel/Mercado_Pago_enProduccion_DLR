var funcReg = {}
const fs = require("fs");
const request = require('request');


async function sucursalesRegistroMP(sucursales, user_id, tokenMP) {

    return new Promise((fullfill, error) => {
        var respuesta = [];
        let name = sucursales[0].nombre
        let external_sucursal_id = sucursales[0].external_id
        let street_number = sucursales[0].numero
        let street_name = sucursales[0].calle
        let city = sucursales[0].ciudad
        let state = sucursales[0].provincia
        let latitude = sucursales[0].latitud
        let longitude = sucursales[0].longitud

        var crearSucursal = {

            'method': 'POST',
            'url': 'https://api.mercadopago.com/users/' + user_id + '/stores',
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + '',
                'Content-Type': 'application/json'
            },

            body: {
                "name": '' + name + '',
                "business_hours": {

                    "monday": [
                        {
                            "open": "08:00",
                            "close": "12:00"
                        }
                    ],
                    "tuesday": [
                        {
                            "open": "09:00",
                            "close": "18:00"
                        }
                    ]
                },
                "location": {
                    "street_number": '' + street_number + '',
                    "street_name": '' + street_name + '',
                    "city_name": '' + city + '',
                    "state_name": '' + state + '',
                    "latitude": + latitude,
                    "longitude": + longitude,
                    "reference": '' + name + ''
                },
                "external_id": '' + external_sucursal_id + '',
            },
            json: true
        }

        console.log("\n-Registro de la Sucursal:");
        console.log(crearSucursal);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        request(crearSucursal, function (error, response) {

            if (error) throw new Error(error);

            // console.log(response)
            console.log(response.body)
            console.log(response.statusCode);

            let id_mp_suc = response.body.id

            respuesta.push(id_mp_suc);
            console.log(respuesta);

            fullfill(respuesta);
        }, 30000);
    })

}


async function sucursalesBuscarMP(user_id, tokenMP, external_id_store) {

    return new Promise((fullfill, error) => {

        var respuesta = [];

        var buscarExternalSucursal = {

            'method': 'GET',
            'url': 'https://api.mercadopago.com/users/' + user_id + '/stores/search?external_id=' + external_id_store,
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + ''
            }
        }

        console.log("\n-Busqueda de la Sucursal en Mercado Pago:");
        console.log(buscarExternalSucursal);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


        request(buscarExternalSucursal, (error, response) => {

            if (error) throw new Error(error);

            // console.log(response);
            console.log(response.body);
            console.log(response.statusCode);

            bodySuc = JSON.parse(response.body);
            console.log(bodySuc);

            if (bodySuc['results'] == undefined) {
                id_mp_suc = undefined
            }
            else{

                bodySucResults = bodySuc.results
                id_mp_suc = bodySucResults[0].id;
            }

            respuesta.push(id_mp_suc);
            console.log(respuesta);

            fullfill(respuesta)
        });
    })
}


async function cajasRegistroMP(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos) {

    return new Promise((fullfill, error) => {
        var respuesta = [];

        var crearCaja = {

            'method': 'POST',
            'url': 'https://api.mercadopago.com/pos?access_token=' + tokenMP,
            'headers': {
                'Authorization': 'Bearer ' + "'" + tokenMP + "'",
                'Content-Type': 'application/json'
            },
            body: ({
                "name": "Caja Nro " + nro_caja,
                "fixed_amount": true,
                "category": 621102,
                "store_id": parseInt(id_mp_suc),
                "external_store_id": external_id_store,
                "external_id": external_id_pos
            }),
            json: true

        };

        console.log("\n-Registro de la Caja:");
        console.log(crearCaja);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");

        request(crearCaja, function (error, response) {

            if (error) throw new Error(error);

            // console.log(response)
            console.log(response.body)
            console.log(response.statusCode);

            let qr = response.body.qr_code
            let id_mp_pos = response.body.id

            respuesta.push(id_mp_pos);
            respuesta.push(qr);

            fullfill(respuesta)

        });
    })
}


async function cajasBuscarMP(tokenMP, external_id_pos) {

    return new Promise((fullfill, error) => {
        var respuesta = [];

        var buscarExternalCaja = {
            'method': 'GET',
            'url': 'https://api.mercadopago.com/pos?external_id=' + external_id_pos,
            'headers': {
                'Authorization': 'Bearer ' + '' + tokenMP + ''
            }
        }

        console.log("\n-Buscar Caja:");
        console.log(buscarExternalCaja);
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------");


        request(buscarExternalCaja, function (error, response) {

            if (error) throw new Error(error);

            console.log(response.body);
            bodyPos = JSON.parse(response.body).results;

            if (bodyPos[0] == undefined) {
                id_mp_pos = undefined;
                qr = undefined
            }
            else{
                id_mp_pos = bodyPos[0].id;
                qr_body = bodyPos[0].qr_code;
                qr = qr_body;

            }
            
            respuesta.push(id_mp_pos);
            respuesta.push(qr);

            fullfill(respuesta);
        });
    });

}


function asyncSucursal(sucursales, user_id, tokenMP, external_id_store) {

    return new Promise(async function (response, error) {

        try {

            dataBusqueda = await sucursalesBuscarMP(user_id, tokenMP, external_id_store);
            console.log(dataBusqueda);

            if (dataBusqueda[0] == undefined || dataBusqueda[0] == null) {
                try {
    
                    dataRegistro = await sucursalesRegistroMP(sucursales, user_id, tokenMP)
                    console.log(dataRegistro);
    
                    response(dataRegistro[0]);
    
                } catch (error) {
                    let miError = "Error en Registro";
                    console.log(miError);
                    error(miError);
                }
            }
            else {
    
                response(dataBusqueda[0]);
            }

        } catch (error) {
            console.log("Error en Busqueda");
        }
    });
}


function asyncCaja(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos) {

    return new Promise(async function (response, error) {

        try {

            dataBusqueda = await cajasBuscarMP(tokenMP, external_id_pos);
            console.log(dataBusqueda);

            if (dataBusqueda[0] == undefined || dataBusqueda[0] == null) {
                try {
    
                    dataRegistro = await cajasRegistroMP(tokenMP, nro_caja, id_mp_suc, external_id_store, external_id_pos)
                    console.log(dataRegistro);
    
                    response(dataRegistro);
    
                } catch (error) {
                    let miError = "Error en Registro";
                    console.log(miError);
                    error(miError);
                }
            }
            else {
    
                response(dataBusqueda);
            }

        } catch (error) {
            console.log("Error en Busqueda");
        }
    });
}

funcReg.asyncSucursal = asyncSucursal;
funcReg.asyncCaja = asyncCaja;

module.exports = funcReg;