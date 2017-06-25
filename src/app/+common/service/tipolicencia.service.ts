/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Http, Jsonp} from "@angular/http";
import {Licencia} from "../../+dto/maintenance/licencia";
import {TipoLicenciaFilter} from "../../+dto/tipoLicenciaFilter";
import {TipoLicenciaResult} from "../../+dto/tipoLicenciaResult";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {ServiceBase} from "./serviceBase";

@Injectable()
export class TipoLicenciaService {

    private busquedaUrl = '/api/tipoLicencia/obtenerTiposLicencias';
    private busquedaDetalleUrl = '/api/tipoLicencia/obtenerTipoLicenciaDetalle';
    private registrarUrl = '/api/tipoLicencia/registrarTipoLicencia';
    private eliminarUrl = '/api/tipoLicencia/eliminarTipoLicencia';

    constructor(private backendService: BackendService) {
    }

    obtenerTipoLicenciaDetalle(idTipoLicencia: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idTipoLicencia))
            .map(res => <Licencia> res)
            .catch(err=> this.backendService.handleError(err));

    }

    registrarTipoLicencia(tipoLicencia: TipoLicencia) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(tipoLicencia))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }

    obtenerTiposLicencias(busquedaTiposLicencias: TipoLicenciaFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaTiposLicencias))
            .map(res => <TipoLicenciaResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    eliminarTipoLicencia(tipoLicencia: TipoLicencia) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(tipoLicencia.idTipoLicencia))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }
}