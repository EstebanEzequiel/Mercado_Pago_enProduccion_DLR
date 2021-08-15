import { Component, OnInit } from '@angular/core';
import { CausasdeBaja } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-causas-de-baja',
  templateUrl: './causas-de-baja.component.html',
  styleUrls: ['./causas-de-baja.component.css']
})
export class CausasDeBajaComponent implements OnInit {

  constructor(private api: CampoDlrService){
    this.causasbaja=[];
    this.causabaja= {};
    this.causabajaSelecionada = {causabaja:"", nombre:"", editable:false, agregar:false};
  }

  async ngOnInit() {

    this.api.getGenerico('causasbajaanimal').subscribe(data => {
      this.causasbaja = data as CausasdeBaja[];
      this.causasbaja.forEach(k => {
        k.editable=false;
        k.editableAgregar=false;
        k.agregar=false;
        k.backup=k.causabaja;
      });
      
    })
  }

  onClick(endpo:CausasdeBaja){
    endpo.editable=!endpo.editable
    endpo.agregar=!endpo.agregar
    endpo.editableAgregar=!endpo.editableAgregar
  }

  getCausabaja(){
    return this.api.getGenerico('causasbajaanimal');
  }


  deleteCausabaja(causabaja: CausasdeBaja): void {

    if (window.confirm("Estas seguro de borrar esta causa de baja?")) {
      
      this.api.deleteGenerico('causasbajaanimal',  `?causabaja=${causabaja}`).subscribe(response => {
       
        // this.ngOnInit(); /* en una linea se puede llamar a la funcion ngOnInit dentro de esta otra funcion y no hace falta copiar y pegar this.getEndpoints().subscribe(data => {......}) para el refresh automatico de la pag */
        location.reload(); 

        window.confirm("La causa de baja fue eliminada exitosamente.");

      }, (error) => {
        console.error(error, "No se pudo borrar la causa de baja");
      });
    }
  }


  putCausabaja(causabaja: CausasdeBaja){

    if (window.confirm("Confirmar edicion de la causa de baja?")) {
    
      this.api.putGenerico('causasbajaanimal', `?causabaja=${causabaja.backup}`, causabaja).subscribe(data => {
       
        location.reload();

        window.confirm("La causa de baja fue actualizada exitosamente.");
        
      }), (error) => {
        console.error(error, "No se pudo editar la causa de baja");
      };
    }
  }

  postCausabaja(body: CausasdeBaja){

    if (window.confirm("Confirma el envio de la causa de baja?")) {

      this.api.postGenerico('causasbajaanimal', body).subscribe(response => {

        body.agregar = false

        location.reload();

        window.confirm("La causa de baja fue posteada exitosamente.");

      }),(error) => {
        console.error(error, "No se pudo postear la causa de baja.");
      }
    }
  }

  editCausabaja(causasbaja:CausasdeBaja): void {
    causasbaja.editable=true;
  }

  noEditCausabaja(causasbaja:CausasdeBaja): void {
    if (causasbaja.editable==true){
      causasbaja.editable=false; 
      this.ngOnInit();     
    }
  }

  addCausabaja(): void{
    this.causabaja = {causabaja:"", nombre:"", editableAgregar:true, agregar:true};
    this.causasbaja.push(this.causabaja)
  }

  noAddCausabaja(causabaja: any): void{
    
    this.causasbaja.pop() // evolucion de cancelar el posteo del nuevo endpoint
    this.causabaja.agregar = false // regresa el boton verde
  }
  
  causasbaja: CausasdeBaja[];
  causabaja: any;
  causabajaSelecionada: CausasdeBaja;
}
