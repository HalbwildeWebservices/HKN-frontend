import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../authService/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authService: AuthServiceService, private router: Router) {

  }
  public canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return false;
    } else {
      return true;
    }
  }

}
