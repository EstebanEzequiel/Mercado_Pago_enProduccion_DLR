import { Component, OnInit } from '@angular/core';
import { Tropillas } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-carga-tropilla',
  templateUrl: './carga-tropilla.component.html',
  styleUrls: ['./carga-tropilla.component.css']
})
export class CargaTropillaComponent implements OnInit {

  constructor(private api: CampoDlrService) {
    this.tropillas = {
      tropilla: undefined,
      nombre: undefined,
      empresa: undefined,
      alta: undefined,
    }
  }

  ngOnInit(): void { }

  postTropilla(body: Tropillas) {
    this.api.postGenerico('tropilla', body).subscribe(resp => {
      
      location.reload();
      window.confirm("El alta de la tropilla fue exitosa.");

    }),(error) => {
      console.error(error, "No se pudo postear el endpoint.");
    }
  }
  
  tropillas: Tropillas;

}
