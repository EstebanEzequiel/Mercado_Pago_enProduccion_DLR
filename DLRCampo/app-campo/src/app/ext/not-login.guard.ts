import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CampoDlrService } from '../services/campo-dlr.service';

@Injectable({
  providedIn: 'root'
})
export class NotLoginGuard implements CanActivate {
  constructor(private serv: CampoDlrService,private router : Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let islogged  = JSON.parse(localStorage.getItem('username'))
      //console.log(islogged);
      if (islogged!=null) {

        if (this.serv.isLogged() || islogged['login']) {
          //this.router.navigate(['/app/home']);
          return true;
        }
      }
     
      // si el usuario no esta logeado
      this.router.navigate(['/login'], { queryParams: { returnUrl: 'app' }});
      return false;
  }
  
}
