import { Component, OnInit } from '@angular/core';
import { CampoDlrService } from '../services/campo-dlr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  constructor(private serv : CampoDlrService) { 
    this.usuarioIng = '';
    this.passwordIng = ''
  }

  ngOnInit(){}

  usuario = 'dlr';
  password = '123';

  onSumbit(){
    if (this.usuario === this.usuarioIng && this.password === this.passwordIng) {
      this.serv.setLogin(true);
      this.serv.setUser(this.usuario);
      this.serv.irAHome();
    }
    else{
      window.alert("Usuario Invalido o No registrado.")
    }

  }

  usuarioIng: string;
  passwordIng: string;
}
