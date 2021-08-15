import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EndpointProperties, Endpoints } from './interfaces';
import { faTimes, faTags, faCheck,  } from '@fortawesome/free-solid-svg-icons';
import { faEye, faPaperPlane, faTrashAlt, faEdit, faWindowClose, faObjectGroup } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
 
  constructor(private api: ApiService){
    this.endpoints=[];
    this.properties=[];  
    this.title= 'dlr-proyect';
    this.endpoint= {};
    this.property={};
    this.tablaSeleccionda = '';
    this.endpointSelecionado = {endpoint:"", metodo:"", seguridad:"", tabla:"", editable:false, agregar:false, endpointProp:[], backupEndpoint:'', backupMetodo:'', backupTabla:''};
  }

  async ngOnInit() {

    this.getEndpoints().subscribe(data => {
      this.endpoints = data

      this.endpoints.forEach(k => {
        k.endpointProp = [];
        k.editable=false;
        k.editableAgregar=false;
        k.agregar=false;
        k.backupEndpoint=k.endpoint;
        k.backupMetodo=k.metodo;
        k.backupTabla=k.tabla;
      });

      this.getProperties().subscribe(data => {
        this.endpoints.forEach(k => {
          data.forEach(e => {
            if (k.endpoint === e.endpoint && k.metodo === e.metodo) {
              k.endpointProp.push(e);
              e.editableP=false;
              e.agregarP=false;
              e.editableAgregarP=false;
              e.params=false;
              e.backupEndpoint = e.endpoint;
              e.backupMetodo = e.metodo
            }
          })
        })
      });
    });
    
  }

  onClick(endpo:Endpoints, prop: EndpointProperties){

    endpo.editable=!endpo.editable
    endpo.agregar=!endpo.agregar
    endpo.editableAgregar=!endpo.editableAgregar
    
    prop.editableP=!prop.editableP
    prop.agregarP=!prop.agregarP
    prop.editableAgregarP=!prop.editableAgregarP
    prop.params=!prop.params
  }

  getEndpoints(): Observable<Endpoints[]>{
    return  this.api.getEndpoints();
  }

  getProperties(): Observable<EndpointProperties[]>{
    return this.api.getProperties();
  }

  deleteEndpoints(endpoint: string, metodo: string): void {

    if (window.confirm("Estas seguro de borrar este endpoint?")) {
      
      this.api.deleteEndpoints(endpoint, metodo).subscribe(response => {
       
        // this.ngOnInit(); /* en una linea se puede llamar a la funcion ngOnInit dentro de esta otra funcion y no hace falta copiar y pegar this.getEndpoints().subscribe(data => {......}) para el refresh automatico de la pag */
        location.reload(); 

        window.confirm("El endpoint fue eliminado exitosamente.");

      }, (error) => {
        console.error(error, "No se pudo borrar el endpoint");
      });
    }
  }

  deleteProperties(endpoint: string, metodo: string, propiedad: string): void {

    if (window.confirm("Estas seguro de borrar esta propiedad?")) {
      
      this.api.deleteProperties(endpoint, metodo, propiedad).subscribe(response => {

        location.reload();

        window.confirm("La propiedad fue eliminada exitosamente.");

      }, (error) => {
        console.error(error, "No se pudo borrar la propiedad");
      });
    }
  }

  putEndpoints(endpoints:Endpoints): void{

    if (window.confirm("Confirmar edicion del endpoint?")) {
    
      this.api.putEndpoints(endpoints).subscribe(data => {
       
        location.reload();

        window.confirm("El endpoint fue actualizado exitosamente.");
        
      }), (error) => {
        console.error(error, "No se pudo editar el endpoint");
      };
    }
  }

  putProperties(properties:EndpointProperties): void{

    if (window.confirm("Confirmar edicion de la propiedad?")) {
    
      this.api.putProperties(properties).subscribe(data => {
        
        
        location.reload();

        window.confirm("Las propiedades fueron actualizadas exitosamente.");
        
      }), (error) => {
        console.error(error, "No se pudo editar la propiedad");
      };
    }
  }

  postEndpoints(endpoint: Endpoints){

    if (window.confirm("Confirma el envio del endpoint?")) {

      this.api.postEndpoints(endpoint).subscribe(response => {

        endpoint.agregar = false

        location.reload();

        window.confirm("El endpoint fue posteado exitosamente.");

      }),(error) => {
        console.error(error, "No se pudo postear el endpoint.");
      }
    }
  }

  postProperties(properties: EndpointProperties){

    if (window.confirm("Confirma el envio de la propiedad?")) {

      this.api.postProperties(properties).subscribe(resp => {

        properties.agregarP = false
        
        location.reload();

        window.confirm("La propiedades fueron posteadas exitosamente.");

      }),(error) => {
        console.error(error, "No se pudo postear las propiedades.");
      }
    }
  }

  editEndpoints(endpoint:Endpoints): void {
    endpoint.editable=true;
  }

  noEditEndpoints(endpoint:Endpoints): void {
    if (endpoint.editable==true){
      endpoint.editable=false;      
    }
  }

  editEndpointProperties(endpointP:EndpointProperties): void {
    endpointP.editableP=true;
  }

  noEditEndpointProperties(endpointP:EndpointProperties): void {
    if (endpointP.editableP==true) {
      endpointP.editableP=false;
    }
  }

  addEndpoints(): void{
    this.endpoint = {endpoint:"", metodo:"", seguridad:"", tabla:"", editableAgregar:true, agregar:true, endpointProp: []};
    this.endpoints.push(this.endpoint)
  }

  addProperties(): void{
    this.property = {endpoint: this.endpointSelecionado.endpoint, metodo: this.endpointSelecionado.metodo, propiedad:"", columna:"", requerido:"", tipo:"", agregarP: true, editableAgregarP: true}
    this.endpoints.forEach(indice =>{
      indice.endpointProp.push(this.property)
    })
  }

  noAddEndpoints(endpoint: any): void{
    
    this.endpoints.pop() // evolucion de cancelar el posteo del nuevo endpoint
    this.endpoint.agregar = false // regresa el boton verde
  }

  noAddProperties(property: any): void{
    
    property.agregarP = false
    this.endpoints.forEach(indice => {
      indice.endpointProp.pop()
    })
  }

  Modal(endpoint:Endpoints){
    this.endpointSelecionado = endpoint;
  }

  JSONEndpoints(tabla:string){
    this.tablaSeleccionda = tabla
  }

  sendTabla(tablaSeleccionda) {
    this.api.setTabla(tablaSeleccionda);
  }

  ojo = faEye;
  faTimes = faTimes;
  agregar = faTags;
  enviar = faPaperPlane;
  confirmar = faCheck;
  borrar = faTrashAlt;
  editar = faEdit;
  noEditar = faWindowClose;
  JSON = faObjectGroup;
  
  endpoints: Endpoints[];
  properties: EndpointProperties[];
  title: string;
  endpoint: any;
  property: any;
  endpointSelecionado: Endpoints;
  tablaSeleccionda: string;
}