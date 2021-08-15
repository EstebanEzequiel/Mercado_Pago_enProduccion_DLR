import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Endpoints, EndpointProperties } from './interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient){
    
  }

  tabla: string = "";
  url: string = 'http://localhost:7070/api/';

  setTabla(tabla: string) {
    this.tabla = tabla;
  }


  public getEndpoints(): Observable<Endpoints[]> {   
    return this.http.get<Endpoints[]>(this.url + 'endpoints');
  }

  public getProperties(): Observable<EndpointProperties[]> {
    return this.http.get<EndpointProperties[]>(this.url + 'propiedades_endpoints');
  }


// solucion POST
  public postEndpoints(endpoint: Endpoints): Observable<Endpoints>{
    return this.http.post<Endpoints>(this.url + 'endpoints', {
      endpoint: endpoint.endpoint,
      metodo: endpoint.metodo,
      seguridad: endpoint.seguridad,
      tabla: endpoint.tabla
    }); 
  }

  public postProperties(properties: EndpointProperties): Observable<EndpointProperties>{
    return this.http.post<EndpointProperties>(this.url + 'propiedades_endpoints', {
      endpoint: properties.endpoint,
      metodo: properties.metodo,
      propiedad: properties.propiedad,
      columna: properties.columna,
      requerido: properties.requerido,
      tipo: properties.tipo
    }); 
  }

  public putEndpoints(endpoints:Endpoints): Observable<Endpoints>{
    let params = new HttpParams()
    
    params= params.append('endpoint', endpoints.backupEndpoint);
    params= params.append('metodo', endpoints.backupMetodo);
    
    return this.http.put<Endpoints>(this.url + `endpoints`, {
      endpoint: endpoints.endpoint,
      metodo: endpoints.metodo,
      seguridad: endpoints.seguridad,
      tabla: endpoints.tabla
    }, {params:params});
    
  }

  public putProperties(properties:EndpointProperties): Observable<EndpointProperties>{
    let params = new HttpParams()
    
    params= params.append('endpoint', properties.backupEndpoint);
    params= params.append('metodo', properties.backupMetodo);
    
    return this.http.put<EndpointProperties>(this.url + `propiedades_endpoints`, {
      endpoint: properties.endpoint,
      metodo: properties.metodo,
      propiedad: properties.propiedad,
      columna: properties.columna,
      requerido: properties.requerido,
      tipo: properties.tipo
    }, {params:params});
    
  }

  public deleteEndpoints(endpoint: string, metodo: string): Observable<EndpointProperties>{
    return this.http.delete<EndpointProperties>(this.url + `endpoints?endpoint=${endpoint}&metodo=${metodo}`);
  }

  public deleteProperties(endpoint: string, metodo: string, propiedad: string): Observable<Endpoints>{
    return this.http.delete<Endpoints>(this.url + `propiedades_endpoints?endpoint=${endpoint}&metodo=${metodo}&propiedad=${propiedad}`)
  }
}