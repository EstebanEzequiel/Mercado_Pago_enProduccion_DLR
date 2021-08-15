import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class CampoDlrService {
  
  constructor(private router: Router, private httpClient: HttpClient) {
    this.login = false;
  }
  irAHome() {
    this.router.navigateByUrl('app/home/home-contenido');
  }
  setLogin(arg0: boolean) {
    this.login = arg0;
  }
  setUser(usuario: string) {
    localStorage.setItem('username', JSON.stringify({ user: usuario, login: true }));
    this.user = usuario;
  }
  getUsuario(): string {
    return this.user;
  }

  isLogged(): boolean {
    return this.login;
  }

  outUsuario(){
    localStorage.removeItem('username');
    location.reload();
  }

  // -----------------------------------------------------------

  irACargas(){
    this.router.navigateByUrl('app/home/cargas');
  }

  irAVistas() {
    this.router.navigateByUrl('app/home/vistas')
  }

  // metodos API REST

  url: string = 'http://localhost:9003/api/'

  getGenerico(ruta: string) {
    return this.httpClient.get(this.url + ruta);
  }

  postGenerico(ruta: string, body: any) {
    return this.httpClient.post(this.url + ruta, body);
  }

  deleteGenerico(ruta: string, params: string) {
    return this.httpClient.delete(this.url + ruta + params);
  }

  putGenerico(ruta: string, params: string, body: any) {
    return this.httpClient.put(this.url + ruta + params, body);
  }


  private user: string;
  private login: boolean
}
