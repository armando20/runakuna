




import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Response } from "@angular/http";
import { Router } from "@angular/router";
import { tokenNotExpired } from "angular2-jwt";
import { BackendService } from "app/+rest/backend.service";
import { RequestTypes, IUrlOptions } from "app/+rest/backend.model";

@Injectable()
export class AuthenticationService {

    public token: string;
    private authenticateUrl = '/api/auth/login';


    constructor(private backendService: BackendService,  private router: Router){}


    public login(username: string, password: string): Observable<boolean> {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.authenticateUrl;


        return this.backendService.Request(RequestTypes.post, urlOptions, 
                                JSON.stringify({username: username, password: password}))
         .map((response: any) => {
            
             let token = response.token;
             if(token){
                this.token = token;    
                localStorage.setItem('token', token);    

                return true;
             }else{
                 return false;
             }

         });
    }

    logout(): void{
        this.token = null;
        localStorage.clear();
        this.router.navigate(['login']);
    }

    loggedIn(){
        return tokenNotExpired();
    }

}