var express = require('express');
var router = express.Router();
var pgDatabase = require('../db/db');

router.put('/:endpoint', (req, res) => {     
    
    console.log("*** Consultando " + req.params.endpoint + ".put");
    var tabla = "";
    var filtros = "";
    var queryRegistros = "";
    var set = "";  
   
    var queryEndpoints = "SELECT * FROM endpoints WHERE endpoint = ${endpoint} AND metodo = 'put'";
    console.log(queryEndpoints);
    
    pgDatabase.query(queryEndpoints, req.params).then(data => {
        //Consultar si el endpoint existe
        if (data.length == 0) {
            return res.badRequest("El endpoint no existe")
        }
        tabla = data[0].tabla;
    })
    .catch(function (error) { return res.sqlError(error.message) });


        var queryPropiedades = "SELECT * FROM propiedades_endpoints WHERE  endpoint = ${endpoint} AND metodo = 'put'";
        
        pgDatabase.query(queryPropiedades, req.params).then(function (dataPropiedades){
            if (dataPropiedades.length == 0) {
                return res.badRequest("El endpoint no tiene propiedades")
            }
                // console.log(dataPropiedades);
                
            for (var indice in dataPropiedades){
                
                var columna = dataPropiedades[indice].columna;
                var propiedad = dataPropiedades[indice].propiedad;
 
                if (req.query[propiedad]){                    
                    filtros = filtros + (filtros === "" ? " WHERE " : " AND ") + columna + " = " + "'" + req.query[propiedad] + "'";
                }
                if (req.body[propiedad]){
                    set = set + (set === "" ? " SET " : " , ") + columna + " = " + "'" + req.body[propiedad] + "'";
                }
            }
        
            queryRegistros = "UPDATE " + tabla + set + filtros;
            console.log(queryRegistros); 
            console.log("-------------------------------------------------")

            pgDatabase.query(queryRegistros, req.body).then(data => {
                return res.status(200).send({msj:"Los datos fueron actualizados exitosamente."});
                
            },err=>{
                res.badRequest(err);
            })
            .catch(function (error) { return res.sqlError(error.message) })
        })
        .catch(function (error) { return res.sqlError(error.message) });
})

module.exports = router;