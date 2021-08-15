import { Component, OnInit } from '@angular/core';
import { CausasdeBaja } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-carga-causasbaja',
  templateUrl: './carga-causasbaja.component.html',
  styleUrls: ['./carga-causasbaja.component.css']
})
export class CargaCausasbajaComponent implements OnInit {

  constructor(private api: CampoDlrService) {
    this.causasdebaja = {
      causabaja: undefined,
      nombre: undefined,
    }
  }

  ngOnInit(): void { }

  postCausasBaja(body: CausasdeBaja) {
    this.api.postGenerico('causasbajaanimal', body).subscribe(resp => {
      
      location.reload();
      window.confirm("El alta de la causa fue exitosa.");

    }),(error) => {
      console.error(error, "No se pudo postear el endpoint.");
    }
  }
  
  causasdebaja: CausasdeBaja;

}
