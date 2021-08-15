import { Component, OnInit } from '@angular/core';
import { Corral } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';

@Component({
  selector: 'app-corrales',
  templateUrl: './corrales.component.html',
  styleUrls: ['./corrales.component.css']
})
export class CorralesComponent implements OnInit {

  constructor(private api: CampoDlrService){
    this.corrales=[];
    this.corral= {};
    this.corralSelecionado = {lotecorral:"", nombre:"", tipo:"", hectareas:"", numero:"", deposito:"", editable:false, agregar:false};
  }

  async ngOnInit() {

    this.api.getGenerico('lotecorral').subscribe(data => {
      this.corrales = data as Corral[];
      this.corrales.forEach(k => {
        k.editable=false;
        k.editableAgregar=false;
        k.agregar=false;
        k.backup=k.lotecorral
      });
      
    })
  }

  onClick(endpo:Corral){
    endpo.editable=!endpo.editable
    endpo.agregar=!endpo.agregar
    endpo.editableAgregar=!endpo.editableAgregar
  }

  getCorral(){
    return this.api.getGenerico('lotecorral');
  }


  deleteCorral(lotecorral: Corral): void {

    if (window.confirm("Estas seguro de borrar este corral?")) {
      
      this.api.deleteGenerico('lotecorral', `?lotecorral=${lotecorral}`).subscribe(response => {
       
        // this.ngOnInit(); /* en una linea se puede llamar a la funcion ngOnInit dentro de esta otra funcion y no hace falta copiar y pegar this.getEndpoints().subscribe(data => {......}) para el refresh automatico de la pag */
        location.reload(); 

        window.confirm("El corral fue eliminado exitosamente.");

      }, (error) => {
        console.error(error, "No se pudo borrar el corral");
      });
    }
  }


  putCorral(corral: Corral){

    if (window.confirm("Confirmar edicion del corral?")) {
    
      this.api.putGenerico('lotecorral', `?lotecorral=${corral.backup}`, corral).subscribe(data => {
       
        location.reload();

        window.confirm("El corral fue actualizado exitosamente.");
        
      }), (error) => {
        console.error(error, "No se pudo editar el corral");
      };
    }
  }

  postCorral(body: Corral){

    if (window.confirm("Confirma el envio del corral?")) {

      this.api.postGenerico('lotecorral', body).subscribe(response => {

        body.agregar = false

        location.reload();

        window.confirm("El corral fue posteado exitosamente.");

      }),(error) => {
        console.error(error, "No se pudo postear el corral.");
      }
    }
  }

  editCorral(corrales:Corral): void {
    corrales.editable=true;
  }

  noEditCorral(corrales:Corral): void {
    if (corrales.editable==true){
      corrales.editable=false;
      this.ngOnInit();
    }
  }

  addCorral(): void{
    this.corral = {lotecorral:"", nombre:"", tipo:"", hectareas:"", numero:"", deposito:"", editableAgregar:true, agregar:true};
    this.corrales.push(this.corral)
  }

  noAddCorral(corral: any): void{
    
    this.corrales.pop() // evolucion de cancelar el posteo del nuevo endpoint
    this.corral.agregar = false // regresa el boton verde
  }
  
  corrales: Corral[];
  corral: any;
  corralSelecionado: Corral;

}
