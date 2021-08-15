import { Component, OnInit } from '@angular/core';
import { CampoDlrService } from '../services/campo-dlr.service';

@Component({
  selector: 'app-home-contenido',
  templateUrl: './home-contenido.component.html',
  styleUrls: ['./home-contenido.component.css']
})
export class HomeContenidoComponent implements OnInit {

  constructor(private servicio: CampoDlrService) { }

  ngOnInit(): void {
  }

  onNavigateCarga(){
    this.servicio.irACargas()
  }

  onNavigateVista(){
    this.servicio.irAVistas()
  }

}
