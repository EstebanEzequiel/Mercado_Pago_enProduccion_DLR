import { Component, OnInit } from '@angular/core';
import { Corral } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-vista-corral',
  templateUrl: './vista-corral.component.html',
  styleUrls: ['./vista-corral.component.css']
})
export class VistaCorralComponent implements OnInit {

  constructor( private api: CampoDlrService) {  this.corrales = [] }

  ngOnInit(): void {
    
    this.api.getGenerico('lotecorral').subscribe(data => {
      this.corrales = data as Corral[];
    })
  }

  corrales: Corral[];

}
