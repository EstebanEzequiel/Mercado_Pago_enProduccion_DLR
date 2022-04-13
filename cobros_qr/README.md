## dlr-ecommerce
El alcance del sistema va desde el registro del usuario como cliente del ecommerce, generando un carrito de compras hasta el pago electronico y la confirmacion del pedido.

### El sistema de ecommerce de DLR se compone de:
* Aplicación Angular del lado del usuario final.
* Servidor Node(Generico Peticiones+Modulo Ecommerce) en el servidor Web.
* Instancias de sigvisual desde en el servidor del cliente.

### Ademas diferentes sistemas auxiliares como:
* SQL server del lado del cliente.
* Postgres en el servidor web.
* Autorizador de cobros electronicos(Tipre)
* Autenticacion (Google)
* Hosting de imagenes optimizado(Cloudinary)

## Funcionamiento
#### Usuarios:
* El usuario sin logearse puede acceder a algunos precios.
* El usuario podra optar por inscribirse a traves de Google(etapa 2 o 3).
* El usuario puede inscribirse desde la pagina y una vez logueado puede acceder a ver los precios de la sucursal en la que decidio retirar el pedido.

#### Configuracion Solutia
Archivo/Supervision/Preferencias E-commerce
* Usuario de Sistema Cliente Web: Representa al usuario de sistema que se les asiganara a todos los usuarios web que se den de alta desde la web del e-commerce. Debe tener los permisos necesarios. (Explayar los permisos)
* Tipo ClienteOL Web: Es el tipo de cliente ol que se les asignara a los clientesol asociados a los usuarios web que se den de alta desde la web del e-commerce.
* Estado Articulo Web: El estadoarticulo que deben poseer los articulos para aparecer en el e-commerce.

## Carga de Datos
#### Sucursales:
* La sucursal debe tener un desito web para estar habilitada en el ecommerce ademas tiene que tener completos los datos de ubicacion: calle, numero, ciudad, latitud y longitud.

#### Articulos
* Los articulos deben tener un estado web (ver configuracion), estar habilitados para la venta y tener precio para la sucursal web en la cual se quiere vender.
* Los precios son los de venta por sucursal, no se usan listas de precios.
* Promociones.

#### Categorias
* Para cargar las categorias hay que ingresar a Archivo/Articulos/Categorias, Las categorias cargadas en ese nivel son las de primer nivel, si luego acceden al vincula categorias pueden agregar los subniveles. Esa vista creo que esta armada para 3 niveles y luego te manda a los articulos, si es necesario se puede editar.
* Para asignar articulos a una categoria hay que filtrar los articulos y desde registro/opciones/asginar categoria masivamente, con eso se asigna una categoria a todos los articulos filtrados.
* Y ademas se puede agregar un campo articulo de tipo categoria que muestra un boton para seleccionar del arbol en edicion y el path de la categoria.

#### Marcas Destacadas
Se puede destacar marcas agregando el campo Destacada Web en si, ademas se agrego una imagen de marca, esta relacion se plasma en el ecommerce a traves de la marca real y no de la marca que usamos siempre en el articulo.

#### Estados para generar tags
Son estados como los demas pero que llegan al ecommerce como tags, se tiene que agregar el campo web en si para que lleguen a la web.
Los articulos que tengan el estado aparecerán con ese tag.

#### Promociones
Las promociones web son una nueva clase de en la cual se modelan solo las promociones que se puede aplicar en el e-commerce, se deben enviar los artículos que representan a la promoción con la cantidad y el monto en 0.
El funcionamiento de las promociones web es el siguiente: 
La promoción se aplica como monto o porcentaje si el carrito de compras cumple tantas veces como se indica en cantidad la regla correspondiente
Ejemplos:
* Cantidad1 = 2, regla1 = "marca=105", monto = -10: si hay 2 articulos de la marca 105 se aplica un descuento de 10.
* Cantidad1 = 2, regla1 = "marca=105", monto = 100: si hay 2 articulos de la marca 105 se cobra 100.
* Cantidad1 = 1, regla1 = "marca=105", porcentaje = 10: si hay 2 articulos de la marca 105 se aplica un descuento del 10%.
En todos estos casos se aplican sobre un solo articulo, se aplica o reemplaza el descuento sobre el total y luego se divide para obetener el precio unitario.

Los combos los dejamos para una etapa mas avanzada
* Cantidad1 = 1,cantidad2 = 1, regla1 = "marca=105 and codigo=125", regla2 = "marca=105 and codigo=1025", monto = 300: Si existen los dos articulos reemplazan por un solo item con el descuento aplicado.

#### Turnos Disponibles
Para cargar las franjas disponibles y el numero maximo de entregas por franja hay que acceder desde la vista de sucursales a los turnos disponibles de la sucursal.

## Diagrama de secuencias sin el modulo Ecommerce en el servidor Web

```mermaid
sequenceDiagram
    participant Angular
    participant Generico 
    participant SQL Server
    participant Instancia
    Angular ->>Instancia: sucursalesweb.get
    Angular ->>Instancia: clienteweb.post
    Angular ->>Instancia: clienteweb.put
    Angular ->>Instancia: login.post
    Angular ->>Instancia: categoriasweb.get
    Angular ->>Instancia: categoriasarticulosweb.get
    Angular ->>Instancia: marcasweb.get
    Angular ->>Instancia: resetjson.get
    Angular ->>Instancia: articulosweb.get
    Angular ->>Instancia: turnosdisponibles.get
    Angular ->>Instancia: promocioneswebec.get
    Angular ->>Instancia: ofertaswebec.get
    alt Cache de consultas
        Instancia ->>SQL Server: articulosweb.get
        SQL Server ->>Instancia: articulosweb.get
    end
```
Las lineas continuas significan un paso sin lógica mayor por el sistema, las lineas punteadas significa que salta el sistema.
Las peticiones devuelven contenidos y errores pero no se representa. La idea es representar el flujo de las peticiones desde el cliente, quien las responde y si tienen una lógica mas compleja.

## Peticiones
#### :subdominio/registrar.POST:
+ descripción: Dar de alta cajas para una determinada sucursal.
+ parametros: si
```json
{
    "sucursal":0,
    "caja":0,
    "token":"",
}
```
+ seguridad: si
+ resultado: en body
```body
00020101021143530016com.mercadolibre0129https://mpago.la/pos/2460326350150011230111111145204970053030325802AR5909Test
Test6004CABA6304DD5B
```

#### :subdominio/anular.DELETE:
+ descripción: cancela un pago anulando la orden correspondiente.
+ parametros: si, en URL
```json
{
    "sucursal":0,
    "caja":0,
    "external_id":0,
    "token":"",
}
```
+ seguridad: si
+ resultado: Errores o mensaje confirmando anulación.
```body
** pago anulado **
```

#### clienteweb.put
+ descripción: Modificación del usuario web logueado.
+ tipopeticion: 702
+ parametros:
```json
{
    "nombre":"",
    "direccion":"",
    "telefonos":"",
    "ciudad":0,
    "dni":0,
    "fechaNacimiento":"1899-31-12",
    "sucursal":0
}
```
+ seguridad: Si
+ resultado: Errores o Nada.

#### clienteweb.get
+ descripción: Datos del usuario web logueado.
+ tipopeticion: 703
+ parametros: No
+ seguridad: Si
+ resultado:
```json
{"registros":
[{
    "clienteol":1,
    "dni":24726379,
    "email":"felipeferrate@gmail.com",
    "fechanacimiento":"1975-06-04",
    "nombre":"Gomez Hernan Javier",
    "sucursal":0,
    "empresa":26588,
    "ciudad":0,
    "direccion":"Florencia 3227 Bº V. Azalaiz",
    "telefonos":"4790523-155319505"
}]}
```

#### login.post

#### categoriasweb.get
+ descripción: Categorías habilitadas para web.
+ tipopeticion: 706
+ parametros: No
+ seguridad: No
+ resultado:
```json
{"registros":
[{
    "categoria":9,
    "nombre":"Aviones",
    "orden":1,
    "padre":0,
    "articulos":2,
    "imagen":"/api/v1/imagenes/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTk4NTYyODEsInBhZHJlIjozMDczNDIsImluc3RhbmNpYSI6MTAwMDAwMDAxfQ.zXwkiMGQ7rY23VIIf5gIlNafpyFs8CZT8Jp-IXexVuc"
}]}
```

#### articulosweb.get
+ descripción: Artículos habilitados para web, se puede filtrar por sucursal.
+ tipopeticion: 704
+ vista: No
+ parametros:
```json
{
    "sucursal":""
}
```
+ seguridad: No
+ resultado:
```json
{"registros":
[{
    "marca":33,
    "codigo":8713,
    "precio":74.99,
    "precionormal":74.99,
    "descripcion":"*LECHE P/PEINAR ELVIVE KERA-LISO",
    "presentacion":"150ml",
    "pesable":472.0000,
    "pesableporunidad":0.0000,
    "nombremarca":"",
    "cantidad":150.000,
    "coeficiente":100.000,
    "preciopor":49.99,
    "unidaddmedida":"ml",
    "cantidadmayorista":0.000,
    "preciomayorista":74.99,
    "marcareal":33,
    "etiquetamedida":"Precio x 100 ml",
    "foto":"/api/v1/imagenes/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTk4NTYzNzYsInBhZHJlIjoyODU3MzgyLCJpbnN0YW5jaWEiOjI1NTg5fQ.4loZDhQp3CFMa0VljDYoh_WxeN4IToiy-l2BClCIOMo",
    "usafoto":1
}]}
```

#### categoriasarticulosweb.get
+ descripción: Articulos por Categorias.
+ tipopeticion: 705
+ parametros: No
+ seguridad: No
+ resultado:
```json
{"registros":
[{
    "marca":24,
    "codigo":739,
    "categoria":9
}]}
```

#### marcasweb.get  
+ descripción: Marcas habilitadas para la web, indica si esta destacada.
+ tipopeticion: 707
+ parametros: No
+ seguridad: No
+ resultado:
```json
{"registros":
[{
    "marca":2154,
    "nombre":"Manfrey",
    "urlexterna":"http://www.manfrey.com.ar",
    "articulos":45,
    "destacada":"S",
    "imagen":"/api/v1/imagenes/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTk4NTYyODEsInBhZHJlIjozMDczNDIsImluc3RhbmNpYSI6MTAwMDAwMDAxfQ.zXwkiMGQ7rY23VIIf5gIlNafpyFs8CZT8Jp-IXexVuc"
}]}
```

#### tagsweb.get  
+ descripción: Devuelve la lista de tags-estados.
+ tipopeticion: 717
+ parametros: No
+ seguridad: No
+ resultado:
```json
{"registros":
[{
    "tag":2154,
    "nombre":"Manfrey"
}]}
```

#### tagsarticulosweb.get  
+ descripción: Devuelve la lista de articulos de cada tags-estados.
+ tipopeticion: 718
+ parametros: No
+ seguridad: No
+ resultado:
```json
{"registros":
[{
    "tag":2154,
    "marca":1,
    "codigo":15
}]}
```

#### resetjson.get  
+ descripción: Resetea todos los json temporales del modulo ecommerce.
+ tipopeticion: 708
+ parametros: No
+ seguridad: No
+ resultado:
```json
{}
```

#### turnosdisponibles.get:
+ descripción: Turnos por Sucursales.
+ tipopeticion: 709
+ parametros: No
+ seguridad: si
+ resultado:
```json
{"registros":
[{
    "dia": 2,
    "horainicio": 1000,
    "horafin": 1200,
    "limiteentrega": 20,
    "sucursal": 3,
    "fecha": "2020-12-07",
    "agendado": 1
}]}
```

#### promocioneswebec.get
+ descripción: Promociones activas, puede filtrarse por sucursal
+ tipopeticion: 710
+ vista: No
+ parametros: No
+ seguridad: No
+ resultado:
```json
{"registros": 
[{
    "idpromocion": 1,
    "regla1": "marca=105 and codigo=125",
    "regla2": "marca=105 and codigo=1025",
    "porcentaje": 0,
    "monto": 300,
    "cantidad1": 1,
    "cantidad2": 1,
    "nombre": "Fernet + Coca por 300",
    "abv": "Fer+Coca",
    "orden": 1,
    "sucursal": 1,
    "desde": "2020-12-01T00:00:00-03:00",
    "hasta": "2020-12-31T00:00:00-03:00",
    "martes": "S",
    "miercoles": "S",
    "jueves": "S",
    "viernes": "N",
    "sabado": "N",
    "domingo": "N",
    "imagen": "/api/v1/imagenes/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDgzMDU3MzIsInBhZHJlIjo4MTQ0MjYyLCJpbnN0YW5jaWEiOjB9.nlp_XdNjsx_sCd3DZm5iOy-Pzmg4Sl3AWVNfMvyl_AY",
    "marca":12,
    "codigo":125
}]}
```

#### ofertaswebec.get
+ descripción: Devuelve la lista de ofertas activas, puede filtrarse por sucursal
+ tipopeticion: 711
+ vista: No
+ parametros: No
+ seguridad: No
+ resultado:
```json
{"registros": 
[{
    "marca": 11,
    "codigo": 5979,
    "fechadesde": "2020-12-01T00:00:00-03:00",
    "fechahasta": "2020-12-31T00:00:00-03:00",
    "sucursal": 1,
    "precio": 231,
    "preciomay": 0,
    "cantidadmayorista": 0
}]}
```

#### itempedidoweb.post
+ descripción: Permite dar de alta una serie de items de pedido web y abrir el documento si es el primer item
+ tipopeticion: 712
+ vista: No
+ parametros:
```json
{"articulos": 
[{
    "marca":0,
    "codigo":0,
    "cantidad":0,
    "precio":0,
    "monto":0,
    "reemplazo":0
}]}
```
+ seguridad: Si
+ resultado:
```json
{}
```

#### itempedidoweb.get
+ descripción: Devuelve la lista de items del pedido abierto, o del pedido que se pasa por parametro
+ tipopeticion: 713
+ vista: No
+ parametros:
```json
{
    "documento":"1"
}
```
+ seguridad: Si
+ resultado:
```json
{"registros": 
[{
    "marca":0,
    "codigo":0,
    "cantidad":0,
    "precio":0,
    "monto":0
}]}
```

#### cerrarpedidoweb.post
+ descripción: Cierra el pedido abierto del usuario logeado o devuelve error si no hay ningun pedido abierto. Devuelve los medios de pago habilitados.
+ tipopeticion: 714
+ vista: No
+ parametros: 
```json
{
    "dia":1,
    "horainicio":1000,
    "fecha":"1899-12-31",
    "observacion":""
}
```
+ seguridad: Si
+ resultado:
```json
{
    "registros": [],
    "statussalida": "",
    "pedido": {
        "documento": 22,
        "tipoformulario": 34,
        "gestion": 2,
        "clienteol": 1,
        "monto": 100,
        "nodo": 1,
        "iddocumento": 1,
        "fecha":"2020-12-01",
        "estado": "Cerrado",
        "medios": [
            {
                "mediopago": 12,
                "nombre": "DINERS",
                "fiid": "12"
            }
        ],
        "items": [
            {
                "marca": 12,
                "codigo": 5,
                "cantidad": 54,
                "precio": 22,
                "monto": 1188
            }
        ]
    }   
}
```

#### planesmediosweb.get
+ descripción: Devuelve los planes habilitados para ese medio y documento.
+ tipopeticion: 721
+ vista: No
+ parametros: 
```json
{
    "documento":"22",
    "mediopago":"199"
}
```
+ seguridad: Si
+ resultado:
```json
{
    "planes": [
        {
            "plan": 1,
            "nombre": "Cta Cte Clientes Online",
            "cuotas": 1,
            "montoCuota": 23.04
        }
    ]
}
```

#### ordenpagoweb.post   
+ descripción: Genera la orden de pago sobre el pedido con el medio y plan seleccionado.
+ tipopeticion: 722
+ vista: No
+ parametros: 
```json
{
    "documento":22,
    "mediopago":199,
    "plan":1
}
```
+ seguridad: Si
+ resultado:
```json
{
    "talon": "Operacion: 30.613, Fecha: 12/03/2021 13:45:55, Numero: 0090X00000038 Cuota 1/1, Titular: Ruiz Ferrate Joaquin Felipe, Autorizado: Ruiz Ferrate Joaquin Felipe e Importe $40,55",
    "mediopago": 997,
    "operacion": 30613,
    "cuotas": 1
}
```

#### pedidosweb.get
+ descripción: Devuelve los pedidos cerrados del usuario logeado(Los estados del pedido son En Carga,Cerrado,Pagado)
+ tipopeticion: 719
+ vista: No
+ parametros: No
+ seguridad: Si
+ resultado:
```json
{
    "pedidos": [
        {
            "documento": 22,
            "tipoformulario": 34,
            "gestion": 2,
            "clienteol": 1,
            "monto": 100,
            "nodo": 1,
            "iddocumento": 1,
            "estado": "Pagado",
            "medios": [
                {
                    "mediopago": 12,
                    "nombre": "DINERS",
                    "fiid": "12"
                }
            ],
            "items": [
                {
                    "marca": 12,
                    "codigo": 5,
                    "cantidad": 54,
                    "precio": 22,
                    "monto": 1188
                }
            ]
        }
    ],
    "statussalida": ""
}
```

#### configuracionecommerce.get
+ descripción: Devuelve la configuracion del sistema
+ tipopeticion: 715
+ vista: No
+ parametros: No
+ seguridad: Si
+ resultado:
```json
{
    "sucursal": 1,
    "reemplazos": [
        {
            "nombre": "Mariano Max",
            "modo": 1
        },
        {
            "nombre": "No reemplazar",
            "modo": 2
        }
    ]
}
```

#### cambiarsucursal.post
+ descripción: Cambia la sucursal del usuario/cliente ol, en futuras version tiene que recalcular los pedidos y cambiar los valores de los pedidos.
+ tipopeticion: 716
+ vista: No
+ parametros: 
```json
{
    "sucursal":1
}
```
+ seguridad: Si
+ resultado:
```json
{}
```
