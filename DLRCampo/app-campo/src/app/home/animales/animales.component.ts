import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Animales } from 'src/app/interfaces';
import { CampoDlrService } from 'src/app/services/campo-dlr.service';



@Component({
  selector: 'app-animales',
  templateUrl: './animales.component.html',
  styleUrls: ['./animales.component.css']
})
export class AnimalesComponent implements OnInit {

  constructor(private api: CampoDlrService){
    this.animales=[];
    this.animal= {};
    this.animalSelecionado = {idanimal:"", nombre:"", tropilla:"", categoria:"", orejaizquierda:"", orejaderecha:"", alta:"", baja:"", causabaja:"", peso:"", editable:false, agregar:false};
  }

  async ngOnInit() {

    this.api.getGenerico('animales').subscribe(data => {
      this.animales = data as Animales[];
      this.animales.forEach(k => {
        k.editable=false;
        k.editableAgregar=false;
        k.agregar=false;
        k.backup=k.idanimal;
      });
      
    })
  }

  onClick(endpo:Animales){
    endpo.editable=!endpo.editable
    endpo.agregar=!endpo.agregar
    endpo.editableAgregar=!endpo.editableAgregar
  }

  getAnimales(){
    return this.api.getGenerico('animales');
  }


  deleteAnimales(idanimal: Animales): void {

    if (window.confirm("Estas seguro de borrar este animal?")) {
      
      this.api.deleteGenerico('animales',  `?idanimal=${idanimal}`).subscribe(response => {
       
        // this.ngOnInit(); /* en una linea se puede llamar a la funcion ngOnInit dentro de esta otra funcion y no hace falta copiar y pegar this.getEndpoints().subscribe(data => {......}) para el refresh automatico de la pag */
        location.reload(); 

        window.confirm("El animal fue eliminado exitosamente.");

      }, (error) => {
        console.error(error, "No se pudo borrar el animal");
      });
    }
  }

  putAnimales(animales: Animales){

    if (window.confirm("Confirmar edicion del animal?")) {
    
      this.api.putGenerico('animales', `?idanimal=${animales.backup}`, animales).subscribe(data => {
       
        location.reload();

        window.confirm("El animal fue actualizado exitosamente.");
        
      }), (error) => {
        console.error(error, "No se pudo editar el animal");
      };
    }
  }

  postAnimales(body: Animales){

    if (window.confirm("Confirma el envio del animal?")) {

      this.api.postGenerico('animales', body).subscribe(response => {

        body.agregar = false

        location.reload();

        window.confirm("El animal fue posteado exitosamente.");

      }),(error) => {
        console.error(error, "No se pudo postear el animal.");
      }
    }
  }

  editAnimales(animales:Animales): void {
    animales.editable=true;
  }

  noEditAnimales(animales:Animales): void {
    if (animales.editable==true){
      animales.editable=false;  
      this.ngOnInit();    
    }
  }

  addAnimales(): void{
    this.animal = {idanimal:"", nombre:"", tropilla:"", categoria:"", orejaizquierda:"", orejaderecha:"", alta:"", baja:"", causabaja:"", peso:"", editableAgregar:true, agregar:true};
    this.animales.push(this.animal)
  }

  noAddAnimales(animal: any): void{
    
    this.animales.pop() // evolucion de cancelar el posteo del nuevo endpoint
    this.animal.agregar = false // regresa el boton verde
  }
  
  animales: Animales[];
  animal: any;
  animalSelecionado: Animales;


  // ------------------ iconos y propiedad de pipe-----------------------

  buscar = faSearch
  filterPost = '';

}
