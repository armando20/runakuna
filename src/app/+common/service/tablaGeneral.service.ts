import {Injectable} from "@angular/core";
/**
 * Created by javier.cuicapuza on 2/15/2017.
 */
import {environment} from "../../../environments/environment";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {TablaGeneralFilter} from "../TablaGeneralFilter";
import {TablaGeneralResultViewModel} from "../../+dto/tablaGeneralResultViewModel";
import {TablaGeneral} from "../../+dto/maintenance/tablaGeneral";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {ServiceBase} from "./serviceBase";
@Injectable()
export class TablaGeneralService {

    private busquedaGruposUrl = '/api/tablaGeneral/buscarGrupoTablaGeneral';
    private busquedaCodigosUrl = '/api/tablaGeneral/obtenerCodigosTablaGeneral';
    private detalleUrl = '/api/tablaGeneral/obtenerTablaGeneralDetalle';
    private registrarUrl = '/api/tablaGeneral/registrarTablaGeneral';
    private eliminarUrl = '/api/tablaGeneral/eliminarTablaGeneral';

    constructor(private backendService: BackendService) {
    }

    buscarGrupoTablaGeneral(idEmpresa:number){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaGruposUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpresa))
            .map(res => <TablaGeneralResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarCodigos(busquedaCodigos: TablaGeneralFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaCodigosUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaCodigos))
            .map(res => <TablaGeneralResultViewModel[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerTablaGeneralById(idTablaGeneral: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.detalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idTablaGeneral))
            .map(res => <TablaGeneral> res)
            .catch(err=> this.backendService.handleError(err));

    }
    guardarCodigoTablaGeneral(tablaGeneral: TablaGeneral) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(tablaGeneral))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    eliminarTablaGeneral(idTablaGeneral: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idTablaGeneral))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }

}
