var express = require('express');
var router = express.Router();
var pgDatabase = require('../db/db');


router.post('/:endpoint', (req, res) => {

    console.log("Consultando " + req.params.endpoint + ".post");
    var tabla = "";
    var columnas = "";
    var queryRegistros = "";


    //Consultar si el endpoint existe
    var queryEndpoints = "SELECT * FROM endpoints WHERE endpoint = ${endpoint} AND metodo = 'post'";
    console.log(queryEndpoints);
    // console.log(req.params.endpoint);

    // console.log(queryEndpoints);
    pgDatabase.query(queryEndpoints, req.params)
        .then(function (data) {
            if (data.length == 0) {
                //El endpoint no existe
                return res.badRequest("El endpoint no existe")
            }

            //Guardamos el nombre de la tabla
            tabla = data[0].tabla;

            //Perfecto el endpoint existe
            //Consulto las propiedades del endpoint y luego armo la consulta a la base de datos
            var queryPropiedades = "SELECT * FROM propiedades_endpoints WHERE  endpoint = ${endpoint} AND metodo = 'post'";
            
            pgDatabase.query(queryPropiedades, req.params)
                .then(function (dataPropiedades) {

                    if (dataPropiedades.length == 0){
                        //El endpoint no tiene propiedades
                        return res.badRequest("El endpoint no tiene propiedades")
                    }// console.log(dataPropiedades);

                    //Recorremos las propiedades del endpoint y unimos las columnas para la consulta sql
                    columnas_array = [];

                    for (var indice in dataPropiedades) {
                        // console.log(indice);
                        var columna = dataPropiedades[indice].columna;

                        columnas_array.push(columna);
                        // console.log(columnas_array);

                        var propiedad = dataPropiedades[indice].propiedad;

                        //Corregir esto para que tome los nombre de las propiedades y no de las columnas
                        columnas += columnas + (columnas === "" ? "" : ",") + columna + " AS " + propiedad;
                    }

                    //Pusheamos los elementos a un objeto
                    let campos = [];

                    dataPropiedades.forEach(element => {
                        let requerido = element['requerido'] === 'S' ? true : false;
                        campos.push(
                            {
                                key: element['propiedad'],
                                requerido: requerido,
                                value: req.body[element['propiedad']] // undefined y valor
                            });
                    });


                    // Comprobamos que tenga el body lo que pide la DB
                    let index = 0;
                    var valores_array = [];

                    for (let k of campos) // k = { key : XXX , requerido : false/true , value : "XXX" }
                    {
                        // console.log(k);
                        if (req.body[k.key] == undefined && k.requerido == true) {
                            return res.badRequest('La propiedad ' + Object.keys(req.body)[index] + ' no es valida.');
                        };

                        if (k.value == undefined) {
                            console.log('El valor de la propiedad es undefined');
                        }
                        else {
                            valores_array.push("'" + k.value + "'")
                        }

                        // console.log(k.value);
                        index++;
                    }


                    //Armamos la consulta final a la base de datos
                    queryRegistros = "INSERT INTO " + tabla + " (" + columnas_array + ") " + "VALUES" + " (" + valores_array + ");";
                    console.log("Query: " + queryRegistros)
                    console.log("---------------------------------------------------------------------------")

                    pgDatabase.query(queryRegistros, req.body)
                        .then(data => {

                            //Posteamos
                            return res.status(200).send({msj:"Los datos fueron posteados exitosamente."});
                        })
                        .catch(function (error) { return res.sqlError(error.message) });
                })
                .catch(function (error) { return res.sqlError(error.message) });
        })
        .catch(function (error) { return res.sqlError(error.message) });
})

module.exports = router;