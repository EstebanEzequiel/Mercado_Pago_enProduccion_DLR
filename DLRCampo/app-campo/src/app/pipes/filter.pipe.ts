import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ 
    name: 'Filter' 
})

export class FilterPipe implements PipeTransform {
  
  transform(value: any, arg: any): any {

    // if(arg === '' || arg.length < ) return value;

    const resultPost = [];
    
    for (const post of value) {
      console.log(post);
      
        if(post.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1){
          resultPost.push(post);
        };

        if(post.tropilla.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1){
          resultPost.push(post);
        };
    };
    return resultPost;    
  }
}