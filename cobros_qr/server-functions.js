var func = {}
const fs = require("fs");
const moment = require("moment");

function dominioToken(domains, token, subdomain) {

    var respuesta = []
    var subD_encontrado = false
    var token_encontrado = false
    var tokenMP = ''

    for (let element of domains) {

        if (subdomain === element.domain) {
            subD_encontrado = true

            if (token === element.token) {
                token_encontrado = true
                tokenMP = element.tokenMP
            }
        }
    }
    
    respuesta.push(subD_encontrado)
    respuesta.push(token_encontrado)
    respuesta.push(tokenMP)

    subD_encontrado = false
    token_encontrado = false
    tokenMP = ''
    
    return respuesta

}

function appendLogs(data) {

    fs.appendFile("./log-api.log", "\n" + JSON.stringify("[" +  moment().format("DD-MM-YYYY HH:mm:ss") + "]: " + data), (err) => {
        if (err) console.log(err);
        // fs.readFile('utils/logs/log-api.log', (error, input)=>{
        //     console.log(input.toString());
        // })
    });
}



func.appendLogs = appendLogs;
func.dominioToken = dominioToken;

module.exports = func;
