
var express = require('express');
var router = express.Router();
var pgDatabase = require('../db/db');

router.delete("/:endpoint", (req, res) => {

    console.log("Consultando " + req.params.endpoint + ".delete");
    var tabla = "";
    /* var columnas = ""; */
    var filtros = "";
    var queryRegistros = "";


    var queryEndpoints = "SELECT * FROM endpoints WHERE endpoint = ${endpoint} AND metodo = 'delete'";
    console.log(queryEndpoints)

    pgDatabase.query(queryEndpoints, req.params).then(function (data) {
        if (data.length == 0) {

            return res.badRequest("El endpoint no existe")
        }

        tabla = data[0].tabla;
        //console.log(tabla);

        var queryPropiedades = "SELECT * FROM propiedades_endpoints WHERE  endpoint = ${endpoint} AND metodo = 'delete'";
        pgDatabase.query(queryPropiedades, req.params).then(function (dataPropiedades) {

            if (dataPropiedades.length == 0) {
                return res.badRequest("El endpoint no tiene propiedades")
            }
            // console.log(dataPropiedades);

            for (var indice in dataPropiedades) {
                // console.log(indice);
                var columna = dataPropiedades[indice].columna;
                var propiedad = dataPropiedades[indice].propiedad;
 
               
                if (req.query[propiedad]) {
                    filtros = filtros + (filtros === "" ? " WHERE " : " AND ") + columna + "=" + "'" + req.query[propiedad] + "'";
                }
            }


            //comprobar que el id este en dataPropiedades

            /* let existeEnDb = false;
            for (let i of dataPropiedades) {
                if (req.params.id.split('=')[0] === i.propiedad) {
                    existeEnDb = true;
                }
            }
 */


            //console.log(req.params.id.split('='));
           /*  if (existeEnDb) { */

                queryRegistros = "DELETE " + " FROM " + tabla + filtros /* " WHERE " + req.params.id.split('=')[0] + " = " + req.params.id.split('=')[1] */ + ";";
                console.log(queryRegistros);
                console.log("---------------------------------------------------------------------------")
                pgDatabase.query(queryRegistros, req.params).then(function (dataRegistros) {

                        return res.json(dataRegistros);
                    })
                    .catch(function (error) { return res.sqlError(error.message) });
            /* } else {
                return res.badRequest("El endpoint no tiene propiedades")
            } */
        })
            .catch(function (error) { return res.sqlError(error.message) });
    })
        .catch(function (error) { return res.sqlError(error.message) });
})


// mount the router on the app

module.exports = router;