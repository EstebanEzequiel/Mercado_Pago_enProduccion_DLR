import { Component, OnInit } from '@angular/core';
import { Animales } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-vista-animales',
  templateUrl: './vista-animales.component.html',
  styleUrls: ['./vista-animales.component.css']
})
export class VistaAnimalesComponent implements OnInit {
  
  constructor( private api: CampoDlrService) {  this.animales = [] }

  ngOnInit(): void {
    
    this.api.getGenerico('animales').subscribe(data => {
      this.animales = data as Animales[];
    })
  }

  animales: Animales[];
}
