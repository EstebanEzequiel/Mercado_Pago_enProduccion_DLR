import { Component, OnInit } from '@angular/core';
import { Corral } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-carga-corral',
  templateUrl: './carga-corral.component.html',
  styleUrls: ['./carga-corral.component.css']
})
export class CargaCorralComponent implements OnInit {

  constructor(private api: CampoDlrService) {
    this.corrales = {
      lotecorral: undefined,
      nombre: undefined,
      tipo: undefined,
      hectareas: undefined,
      numero: undefined,
      deposito: undefined
    }
  }

  ngOnInit(): void { }

  postCorral(body: Corral) {
    this.api.postGenerico('lotecorral', body).subscribe(resp => {
      
      location.reload();
      window.confirm("El alta del corral fue exitosa.");

    }),(error) => {
      console.error(error, "No se pudo postear el endpoint.");
    }
  }
  
  corrales: Corral;

}
