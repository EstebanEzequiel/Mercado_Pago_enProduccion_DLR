
var express = require('express');
var router = express.Router();
var pgDatabase=require('../db/db');

router.get('/:endpoint', (req, res) => {

    console.log("*****Consultando " + req.params.endpoint + ".get");
    var tabla = "";
    var columnas = "";
    var filtros = "";
    var queryRegistros = "";
    var filtroespecial = "";

    if(req.params.endpoint==="endpoints"||req.params.endpoint==="propiedades_endpoints"){
        filtroespecial = "endpoint not like 'endpoints' and endpoint not like 'propiedades_endpoints'"
    }

    //Consultar si el endpoint existe
    var queryEndpoints = "SELECT * FROM endpoints WHERE endpoint = ${endpoint} AND metodo = 'get'";
    console.log(queryEndpoints);

    pgDatabase.query(queryEndpoints, req.params).then(function (data) {
        
            if (data.length == 0) {
                //El endpoint no existe
                return res.badRequest("El endpoint no existe")
            }
            //Guardamos el nombre de la tabla
            tabla = data[0].tabla;
            //Perfecto el endpoint existe
            //Consulto las propiedades del endpoint y luego armo la consulta a la base de datos
            var queryPropiedades = "SELECT * FROM propiedades_endpoints WHERE  endpoint = ${endpoint} AND metodo = 'get'";
            pgDatabase.query(queryPropiedades, req.params).then(function (dataPropiedades) {

                    if (dataPropiedades.length == 0) {
                        //El endpoint no existe
                        return res.badRequest("El endpoint no tiene propiedades")
                    }
                    // console.log(dataPropiedades);
                    //Recorremos las propiedades del endpoint y unimos las columnas para las consulta sql
                    //Y tambien los filtros
                    for (var indice in dataPropiedades) {
                        // console.log(indice);
                        var columna = dataPropiedades[indice].columna;
                        var propiedad = dataPropiedades[indice].propiedad;
                        //Corregir esto para que tome los nombre de las propiedades y no de las columnas
                        columnas = columnas + (columnas === "" ? "" : ",") + columna + " AS " + propiedad;
                        if (req.query[propiedad]) {
                            
                            filtros = filtros + (filtros === "" ? " WHERE " : " AND ") + columna + "='" + req.query[propiedad] + "'";
                        }
                    }
                    if(tabla == 'endpoints' || tabla == 'propiedades_endpoints'){
                        filtros = filtros + (filtros === "" ? " WHERE " : " AND ") + filtroespecial;
                    }

                    //Armamos la consulta final a la base de datos para obtener los registros asociados al enpoint segun la descripcion consultada
                    queryRegistros = "SELECT " + columnas + " FROM " + tabla + filtros;
                    console.log("Query: " + queryRegistros);
                    console.log("---------------------------------------------------------------------------")
                    pgDatabase.query(queryRegistros, req.params)
                        .then(function (dataRegistros) {
                            //Devolvemos los registros
                            return res.json(dataRegistros);
                        })
                        .catch(function (error) { return res.sqlError(error.message) });
                })
                .catch(function (error) { return res.sqlError(error.message) });
        })
        .catch(function (error) { return res.sqlError(error.message) });
})




module.exports = router;