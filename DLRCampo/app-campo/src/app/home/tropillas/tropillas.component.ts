import { Component, OnInit } from '@angular/core';
import { Tropillas } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-tropillas',
  templateUrl: './tropillas.component.html',
  styleUrls: ['./tropillas.component.css']
})
export class TropillasComponent implements OnInit {

  constructor(private api: CampoDlrService){
    this.tropillas=[];
    this.tropilla= {};
    this.tropillaSelecionada = {tropilla:"", nombre:"", empresa:"", alta:"", editable:false, agregar:false};
  }

  async ngOnInit() {

    this.api.getGenerico('tropilla').subscribe(data => {
      this.tropillas = data as Tropillas[];
      this.tropillas.forEach(k => {
        k.editable=false;
        k.editableAgregar=false;
        k.agregar=false;
        k.backup=k.tropilla;
      });
      
    })
  }

  onClick(endpo:Tropillas){
    endpo.editable=!endpo.editable
    endpo.agregar=!endpo.agregar
    endpo.editableAgregar=!endpo.editableAgregar
  }

  getTropilla(){
    return this.api.getGenerico('tropilla');
  }


  deleteTropilla(tropilla: Tropillas): void {

    if (window.confirm("Estas seguro de borrar esta tropilla?")) {
      
      this.api.deleteGenerico('tropilla',  `?tropilla=${tropilla}`).subscribe(response => {
       
        // this.ngOnInit(); /* en una linea se puede llamar a la funcion ngOnInit dentro de esta otra funcion y no hace falta copiar y pegar this.getEndpoints().subscribe(data => {......}) para el refresh automatico de la pag */
        location.reload(); 

        window.confirm("La tropilla fue eliminada exitosamente.");

      }, (error) => {
        console.error(error, "No se pudo borrar la tropilla");
      });
    }
  }


  putTropilla(tropilla: Tropillas){

    if (window.confirm("Confirmar edicion de la tropilla?")) {
    
      this.api.putGenerico('tropilla', `?tropilla=${tropilla.backup}`, tropilla).subscribe(data => {
       
        location.reload();

        window.confirm("La tropilla fue actualizada exitosamente.");
        
      }), (error) => {
        console.error(error, "No se pudo editar la tropilla");
      };
    }
  }

  postTropilla(body: Tropillas){

    if (window.confirm("Confirma el envio de la tropilla?")) {

      this.api.postGenerico('tropilla', body).subscribe(response => {

        body.agregar = false

        location.reload();

        window.confirm("La tropilla fue posteada exitosamente.");

      }),(error) => {
        console.error(error, "No se pudo postear la tropilla.");
      }
    }
  }

  editTropilla(tropillas:Tropillas): void {
    tropillas.editable=true;
  }

  noEditTropilla(tropillas:Tropillas): void {
    if (tropillas.editable==true){
      tropillas.editable=false;
      this.ngOnInit();      
    }
  }

  addTropilla(): void{
    this.tropilla = {tropilla:"", nombre:"", empresa:"", alta:"", editableAgregar:true, agregar:true};
    this.tropillas.push(this.tropilla)
  }

  noAddTropilla(tropilla: any): void{
    
    this.tropillas.pop() // evolucion de cancelar el posteo del nuevo endpoint
    this.tropilla.agregar = false // regresa el boton verde
  }
  
  tropillas: Tropillas[];
  tropilla: any;
  tropillaSelecionada: Tropillas;
}
