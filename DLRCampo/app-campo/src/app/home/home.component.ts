import { Component, OnInit } from '@angular/core';
import { CampoDlrService } from '../services/campo-dlr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private serv: CampoDlrService) {
    setTimeout(() => {
      var contenedor = document.getElementById("container-carga");
      contenedor.style.visibility = "hidden";
      contenedor.style.opacity = "0";
    }, 1200);
    this.username = this.serv.getUsuario();
  }

  ngOnInit(): void { }

  cerrarSession() {
    this.serv.outUsuario();
  }

  username: string;
}