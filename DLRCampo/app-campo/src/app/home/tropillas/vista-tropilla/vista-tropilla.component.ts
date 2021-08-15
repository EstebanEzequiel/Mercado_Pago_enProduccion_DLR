import { Component, OnInit } from '@angular/core';
import { Tropillas } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-vista-tropilla',
  templateUrl: './vista-tropilla.component.html',
  styleUrls: ['./vista-tropilla.component.css']
})
export class VistaTropillaComponent implements OnInit {

  constructor( private api: CampoDlrService) {  this.tropillas = [] }

  ngOnInit(): void {
    
    this.api.getGenerico('tropilla').subscribe(data => {
      this.tropillas = data as Tropillas[];
    })
  }

  tropillas: Tropillas[];

}
