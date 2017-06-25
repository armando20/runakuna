/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {VacacionFilter} from "../../+dto/vacacionFilter";
import {VacacionResult} from "../../+dto/vacacionResult";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {VacacionQuickFilter} from "../../+dto/vacacionQuickFilter";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {VacacionPendienteResult} from "../../+dto/vacacionPendienteResult";
import {EmpleadoPlanillaResult} from "../../+dto/empleadoPlanillaResult";
import {VacacionEmpleadoPlanillaResult} from "../../+dto/vacacionEmpleadoPlanillaResult";
import {NotificacionResult} from "../../+dto/notificacionResult";

@Injectable()
export class VacacionService {

    constructor(private backendService: BackendService) {
    }

    obtenerVacacionById(idVacacion: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/obtenerVacacionesEmpleadoDetalle';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idVacacion))
            .map(res => <Vacacion> res)
            .catch(err=> this.backendService.handleError(err));

    }
    buscarVacacionesEmpleado(busquedaVacaciones: VacacionFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/busquedaVacacionesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaVacaciones))
            .map(res => <VacacionResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    busquedaVacacionesPendientesEmpleado(busquedaVacaciones: VacacionFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/busquedaVacacionesPendientesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaVacaciones))
            .map(res => <VacacionPendienteResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    busquedaRapidaVacaciones(quickFilter: VacacionQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/busquedaRapidaVacacionesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <VacacionResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    verVacaciones(periodoEmpleado: PeriodoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verVacaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado))
            .map(res => <Vacacion[]> res)
            .catch(err=> this.backendService.handleError(err));

    }

    obtenerBusquedaEmpleadoPlanilla(busquedaVacaciones: VacacionFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/obtenerBusquedaEmpleadoPlanilla';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaVacaciones))
            .map(res => <EmpleadoPlanillaResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    registrarVacacionesEnPanilla(vacacionEnPlanilla: VacacionEmpleadoPlanillaResult) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/registrarVacacionesEnPanilla';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(vacacionEnPlanilla))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerDiasVacacionesPendientes(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/obtenerDiasVacacionesPendientes';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado))
            .map(res => <number> res)
            .catch(err=>
                this.backendService.handleError(err)
            );
    }

}