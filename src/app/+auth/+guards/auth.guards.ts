



import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import {AuthenticationService} from "../+services/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthenticationService, private router: Router){

    }


    canActivate() {

        if (!this.auth.loggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;

    }




}