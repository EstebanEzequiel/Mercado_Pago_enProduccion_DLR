import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-campo';

  // @HostListener("window:beforeunload", ["$event"]) 
  //   unloadHandler(event: Event) {
  //        console.log('se fue de la pagina!!');
  //       event.returnValue = false;
  //   }
}
