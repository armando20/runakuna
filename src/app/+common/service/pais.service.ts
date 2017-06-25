import {Injectable} from "@angular/core";
import {PaisDto} from "../../+personal/+empleado/paisDto";
import {DepartamentoDto} from "../../+personal/+empleado/departamentoDto";
import "rxjs/Rx";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {PaisCombo} from "../../+dto/paisCombo";
import {DepartamentoCombo} from "../../+dto/departamentoCombo";
import {ProvinciaCombo} from "../../+dto/provinciaCombo";
import {DistritoCombo} from "../../+dto/distritoCombo";

declare var $: any;

@Injectable()
export class PaisService{

    constructor(private backendService: BackendService) {
    }
    
    completarComboPais() {
        
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/pais/obtenerPaises';
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <PaisCombo[]> res)
            .catch(err=> this.backendService.handleError(err));
    }
    
    completarComboDepartamento(idPais:number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/pais/obtenerDepartamentos?idPais='+idPais;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <DepartamentoCombo[]> res)
            .catch(err=> this.backendService.handleError(err));
    }
    
    completarComboProvincia(idDpto:number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/pais/obtenerProvincias?idDpto='+idDpto;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <ProvinciaCombo[]> res)
            .catch(err=> this.backendService.handleError(err));
    }
    
    completarComboDistrito(idProvincia:number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/pais/obtenerDistritos?idProvincia='+idProvincia;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <DistritoCombo[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

}
