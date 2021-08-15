import { Component, OnInit } from '@angular/core';
import { Animales } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-carga-animales',
  templateUrl: './carga-animales.component.html',
  styleUrls: ['./carga-animales.component.css']
})
export class CargaAnimalesComponent implements OnInit {

  constructor(private api: CampoDlrService) {
    this.animales = {
      idanimal: undefined,
      nombre: undefined,
      tropilla: undefined,
      categoria: undefined,
      orejaizquierda: undefined,
      orejaderecha: undefined,
      alta: undefined,
      baja: undefined,
      causabaja: undefined,
      peso: undefined,
    }
  }

  ngOnInit(): void { }

  postAnimales(body: Animales) {
    this.api.postGenerico('animales', body).subscribe(resp => {
      
      location.reload();
      window.confirm("El alta del animal fue exitosa.");

    }),(error) => {
      console.error(error, "No se pudo postear el endpoint.");
    }
  }
  
  animales: Animales;
}
