/**
 * Created by josediaz on 6/25/17.
 */
import {Headers, Http} from "@angular/http";
import {Injectable} from "@angular/core";

import {AutorizacionFilter} from "../../+dto/autorizacionFilter";

import {BackendService} from "../../+rest/backend.service";
import {StorageResult} from "../../+dto/storageResult";
/**
 * Created by javier.cuicapuza on 1/16/2017.
 */
@Injectable()
export class StorageService {

    private localStorageCommonsUrl = 'http://localhost:8080/localStorage/obtenerLocalStorage';

    constructor(private http:Http, private backendService: BackendService) {
    }

    /*CALL BACKEND*/
    retrieveComboLocalStorage(autorizacionFilter: AutorizacionFilter){
        let header = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.localStorageCommonsUrl,JSON.stringify(autorizacionFilter), {headers: header})
            .map(res => <StorageResult> res.json())
            .catch(err=> this.backendService.handleError(err));

    }
    /*CALL SERVICE*/
    errorMessage: string;

    public localStorageValuesCommons(data: StorageResult){
        localStorage.setItem("sharedSession", JSON.stringify(data));
    }

}
