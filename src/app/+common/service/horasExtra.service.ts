/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
import {Injectable} from "@angular/core";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {HorasExtraFilter} from "../../+dto/horasExtraFilter";
import {HorasExtraResult} from "../../+dto/horasExtraResult";
import {HorasExtraQuickFilter} from "../../+dto/horasExtraQuickFilter";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";

@Injectable()
export class HorasExtraService {

    private buscarHorasExtrasEmpleadoUrl = '/api/horasExtra/obtenerHorasExtrasEmpleado';
    private busquedaRapidaHorasExtrasEmpleadoUrl = '/api/horasExtra/busquedaRapidaHorasExtrasEmpleado';
    private obtenerHorasExtraByIdUrl = '/api/horasExtra/obtenerHorasExtrasEmpleadoDetalle';
    private recuperarHorasUrl = '/api/horasExtra/recuperarHoras';

    constructor(private backendService: BackendService) {
    }

    obtenerHorasExtraById(idHorasExtra: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.obtenerHorasExtraByIdUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idHorasExtra))
            .map(res => <Vacacion> res)
            .catch(err=> this.backendService.handleError(err));

    }
    buscarHorasExtrasEmpleado(busquedaHorasExtras: HorasExtraFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarHorasExtrasEmpleadoUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaHorasExtras))
            .map(res => <HorasExtraResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    busquedaRapidaHorasExtrasEmpleado(quickFilter: HorasExtraQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaRapidaHorasExtrasEmpleadoUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <HorasExtraResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    verHorasExtras(periodoEmpleado: PeriodoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/verHorasExtras';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado))
            .map(res => <Vacacion[]> res)
            .catch(err=> this.backendService.handleError(err));

    }

    recuperarHoras(horasExtra: HorasExtra) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.recuperarHorasUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerHorasSemanalesPendientes(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/obtenerHorasSemanalesPendientes';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HorasExtra> res)
            .catch(err=> this.backendService.handleError(err));

    }
}