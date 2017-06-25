




import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { tokenNotExpired } from "angular2-jwt";
import { BackendService } from "app/+rest/backend.service";
import { RequestTypes, IUrlOptions } from "app/+rest/backend.model";
import {CurrentUser} from "../../+dto/currentUser";
import {AssignedRole} from "../../+dto/assignedRole";

@Injectable()
export class AuthenticationService {

    public token: string;
    private authenticateUrl = '/api/auth/login';
    private currentUserUrl =  '/login/authenticate?cuentaUsuario=';
    private localStorageCommonsUrl = '/localStorage/obtenerLocalStorage';
    private retrieveRolsNameUserUrl =  '/login/retrieveRolsNameUser?idUsuario=';


    constructor(private backendService: BackendService,  private router: Router){}


    public authenticateUser(cuentaUsuario: string) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.currentUserUrl + cuentaUsuario;

        return this.backendService.Request(RequestTypes.get, urlOptions)
            .map(res => <CurrentUser> res)
            .catch(this.handleError);
    }

    public retrieveRolsNameUser(idUsuario: number) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.retrieveRolsNameUserUrl + idUsuario;
        return this.backendService.Request(RequestTypes.get, urlOptions)
            .map(res => <AssignedRole[]> res)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json() || 'Server error');
    }

    public login(username: string, password: string): Observable<boolean> {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.authenticateUrl;
        return this.backendService.Request(RequestTypes.post, urlOptions, JSON.stringify({ username: username, password: password }))
            .map((response: any) => {
                // login successful if there's a jwt token in the response

                let token = response.token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('token', token);

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    logout(): void{
        this.token = null;
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['login']);
    }

    loggedIn(){
        return tokenNotExpired();
    }

}