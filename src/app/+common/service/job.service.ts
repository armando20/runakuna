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
import {JobResult} from "../../+dto/jobResult";
import {JobEjecucion} from "../../+dto/maintenance/jobEjecucion";
import {JobExecuteManuallyFilter} from "../../+dto/jobExecuteManuallyFilter";

@Injectable()
export class JobService {

    private busquedaUrl = '/api/job/obtenerJobs';
    private busquedaDetalleUrl = '/api/job/obtenerJobDetalle';
    private executeJobManuallyUrl = '/api/job/executeManuallyJob';


    constructor(private backendService: BackendService) {
    }

    obtenerDetalleEjecuciones(jobEjecucion: JobEjecucion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(jobEjecucion))
            .map(res => <JobEjecucion[]> res)
            .catch(err=> this.backendService.handleError(err));

    }

    obtenerJobs() {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions)
            .map(res => <JobResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    executeJobManually(jobFilter: JobExecuteManuallyFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.executeJobManuallyUrl;

        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(jobFilter))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }


}