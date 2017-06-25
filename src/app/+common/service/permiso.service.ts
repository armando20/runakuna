import {Injectable} from "@angular/core";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {Empleado} from "../../+dto/maintenance/empleado";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {PermisoFilter} from "../../+dto/permisoFilter";
import {PermisoEmpleadoResult} from "../../+dto/permisoEmpleadoResult";
import {PermisoEmpleadoQuickFilter} from "../../+dto/permisoEmpleadoQuickFilter";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {EmpleadoCompensacionResult} from "../../+dto/empleadoCompensacionResult";
import {HorarioEmpleadoDiaResult} from "../../+dto/horarioEmpleadoDiaResult";

@Injectable()
export class PermisoService{

    constructor(private backendService: BackendService) {
    }

    completarComboBox(metodo: string) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/tablaGeneral/'+ metodo;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions)
            .map(res => <TablaGeneralResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerHistoriaLaboralActual(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHistoriaLaboralActual';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <HistorialLaboral> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerHistoriasLaboralesActualPorEmpleado(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHistoriasLaboralesActualPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <HistorialLaboral[]> res)
            .catch(err=> this.backendService.handleError(err));

    }

    obtenerHistoriasLaboralesPorEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHistoriasLaboralesPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado))
            .map(res => <HistorialLaboral[]> res)
            .catch(err=> this.backendService.handleError(err));

    }

    obtenerHorasPorCompensarPorEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHorasPorCompensarPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado))
            .map(res => <EmpleadoCompensacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }

    obtenerHistoriaLaboralLicencia(busquedaLicencia: LicenciaFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHistoriaLaboralLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaLicencia))
            .map(res => <HistorialLaboral> res)
            .catch(err=> this.backendService.handleError(err));

    }

    obtenerInformacionAdicional(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/informacionAdicionalHorasExtras';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <HorasExtra> res)
            .catch(err=> this.backendService.handleError(err));

    }

    obtenerPeriodoEmpleadoActual(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerPeriodoEmpleadoActual';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <PeriodoEmpleado> res)
            .catch(err=> this.backendService.handleError(err));

    }
    obtenerDiasDisponiblesDeVacacion(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/obtenerDiasDisponibles';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <Vacacion> res)
            .catch(err=> this.backendService.handleError(err));

    }
    obtenerPeriodoActual(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/obtenerPeriodo';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <Vacacion> res)
            .catch(err=> this.backendService.handleError(err));

    }

    /* ADMINISTRAR PERMISO */
    buscarPermisoEmpleado(busquedaPermisos: PermisoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/busquedaPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaPermisos))
            .map(res => <PermisoEmpleadoResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    busquedaRapidaPermisoEmpleado(quickFilter: PermisoEmpleadoQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/busquedaRapidaPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <PermisoEmpleadoResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerPermisoEmpleadoById(idPermisoEmpleado: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerPermisoEmpleadoDetalle';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idPermisoEmpleado))
            .map(res => <PermisoEmpleado> res)
            .catch(err=> this.backendService.handleError(err));

    }
    registrarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/registrarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    actualizarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/actualizarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    enviarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/enviarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    aprobarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/aprobarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    rechazarPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/rechazarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    devolverPermisoEmpleado(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/devolverPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    actualizarPermisoEmpleadoDatosPersonales(permisoEmpleado: PermisoEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/actualizarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    enviarPermisoEmpleadoDatosPersonales(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/actualizarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerHorarioEmpleadoDia(permisoEmpleado: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/obtenerHorarioEmpleadoDia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisoEmpleado))
            .map(res => <HorarioEmpleadoDiaResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

}
