import {Injectable} from "@angular/core";
import {PeriodoEmpleadoFilter} from "../../+dto/periodoEmpleadoFilter";
import {PeriodoEmpleadoResult} from "../../+dto/PeriodoEmpleadoResult";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
/**
 * Created by javier.cuicapuza on 2/21/2017.
 */
@Injectable()
export class PeriodoEmpleadoService {

    constructor(private backendService: BackendService) {
    }

    buscarPeriodoEmpleado(periodoEmpleadoFilter: PeriodoEmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/periodoEmpleado/busquedaPeriodoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleadoFilter))
            .map(res => <PeriodoEmpleadoResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerPeriodosConVacacionesDisponibles(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/periodoEmpleado/obtenerPeriodosConVacacionesDisponibles';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado))
            .map(res => <PeriodoEmpleado[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    busquedaPeriodoDisponibleVacaciones(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/periodoEmpleado/busquedaPeriodoDisponibleVacaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado))
            .map(res => <PeriodoEmpleadoResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }
}
