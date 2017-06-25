/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {ConfiguracionSistema} from "../../+dto/maintenance/configuracionSistema";
import {ConfiguracionSistemaFilter} from "../../+dto/configuracionSistemaFilter";
import {ConfiguracionSistemaResult} from "../../+dto/configuracionSistemaResult";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {Marcador} from "../../+dto/maintenance/marcador";
import {MarcadorFilter} from "../../+dto/marcadorFilter";
import {MarcadorResult} from "../../+dto/marcadorResult";

@Injectable()
export class MarcadorService {

    private busquedaUrl = '/api/marcador/obtenerMarcadores';
    private busquedaDetalleUrl = '/api/marcador/obtenerMarcador';
    private registrarUrl = '/api/marcador/registrarMarcador';
    private deleteUrl = '/api/marcador/eliminarMarcador';


    constructor(private backendService: BackendService) {
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }

    obtenerMarcador(idMarcador: any) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idMarcador))
            .map(res => <Marcador> res)
            .catch(this.handleError);

    }

    eliminarMarcador(idMarcador: any) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.deleteUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idMarcador))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);

    }

    registrarMarcador(marcador: Marcador) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(marcador))
            .map(res => <NotificacionResult> res)
            .catch(this.handleError);


    }

    obtenerMarcadores(busquedaMarcador: MarcadorFilter) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,busquedaMarcador)
            .map(res => <MarcadorResult[]> res)
            .catch(this.handleError);
    }


}