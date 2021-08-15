import { Component, OnInit } from '@angular/core';
import { CausasdeBaja } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-vista-causasbaja',
  templateUrl: './vista-causasbaja.component.html',
  styleUrls: ['./vista-causasbaja.component.css']
})
export class VistaCausasbajaComponent implements OnInit {
  
  constructor( private api: CampoDlrService) {  this.causasbaja = [] }

  ngOnInit(): void {
    
    this.api.getGenerico('causasbajaanimal').subscribe(data => {
      this.causasbaja = data as CausasdeBaja[];
    })
  }

  causasbaja: CausasdeBaja[];

}
