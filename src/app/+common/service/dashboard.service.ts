/**
 * Created by javier.cuicapuza on 1/11/2017.
 */
import {Injectable} from "@angular/core";
import {MarcacionDashboardFilter} from "../../+dto/marcacionDashboardFilter";
import {MarcacionDashboardResult} from "../../+dto/marcacionDashboardResult";
import {PieChartDataResult} from "../../+dto/pieChartDataResult";
import {PermisoEmpleadoResult} from "../../+dto/permisoEmpleadoResult";
import {VacacionResult} from "../../+dto/vacacionResult";
import {HorasExtraResult} from "../../+dto/horasExtraResult";
import {MarcacionDashboardEmpleadoFilter} from "../../+dto/marcacionDashboardEmpleadoFilter";
import {IndicadorRRHHResultViewModel} from "../../+dto/indicadorRRHHResultViewModel";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {IndicadorJefeResultViewModel} from "../../+dto/indicadorJefeResultViewModel";
import {MarcacionResult} from "../../+dto/marcacionResult";
import {IndicadorVacacionesResult} from "../../+dto/indicadorVacacionesResult";
import {LicenciaResult} from "../../+dto/licenciaResult";
import {NotificacionResult} from "../../+dto/notificacionResult";

@Injectable()
export class DashBoardService {

    private buscarMarcacionesDashboardUrl = '/api/dashboard/busquedaMarcacionesDashboardRRHH';
    private buscarMarcacionesDashboardUrlAll = '/api/dashboard/busquedaMarcacionesDashboardRRHHAll';
    private buscarMarcacionesDashboardJefeUrl = '/api/dashboard/busquedaMarcacionesDashboardJefe';
    private buscarMarcacionesDashboardJefeUrlAll = '/api/dashboard/busquedaMarcacionesDashboardJefeAll';
    private buscarMarcacionesDashboardEmpleadoUrl = '/api/dashboard/buscarMarcacionesDashboardEmpleado';
    constructor(private backendService: BackendService) {
    }

    /* Dashboard */
    buscarMarcacionesDashboard(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarMarcacionesDashboardUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionDashboardResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarMarcacionesDashboardAll(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarMarcacionesDashboardUrlAll;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionDashboardResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarMarcacionesDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarMarcacionesDashboardJefeUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionDashboardResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarMarcacionesDashboardJefeAll(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarMarcacionesDashboardJefeUrlAll;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionDashboardResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarMarcacionesDashboardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.buscarMarcacionesDashboardEmpleadoUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionDashboardResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarMarcacionPieChartRRHH(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarMarcacionPieChartRRHH';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PieChartDataResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarMarcacionPieChartJefe(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarMarcacionPieChartJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PieChartDataResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarEmpleadoIndicadorDashBoardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarIndicadorEmpleadoDashBoardXmes';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PieChartDataResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarEmpleadoIndicadorDashBoardRRHH(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarIndicadorRRHHDashBoard';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <IndicadorRRHHResultViewModel[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarEmpleadoIndicadorDashBoardJefe(busquedaMarcacion: MarcacionDashboardFilter) {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarIndicadorJefeDashBoard';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <IndicadorJefeResultViewModel[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarMarcacionEmpleadoPieChartEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarMarcacionEmpleadoPieChartEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PieChartDataResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarPermisoDashboardRRHH(busquedaMarcacion: MarcacionDashboardFilter){
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaPermisoDashboardRRHH';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PermisoEmpleadoResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }
    buscarPermisoDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter){
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaPermisoDashboardJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PermisoEmpleadoResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }
    buscarPermisoDashboardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter){
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaPermisoDashboardEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <PermisoEmpleadoResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }
    eliminarPermisoEmpleado(permisos: PermisoEmpleadoResult) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/eliminarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisos)).map(res => <String> res)
            .catch(err=> this.backendService.handleError(err));

    }

    eliminarVacacion(vacacion: VacacionResult) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/eliminarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(vacacion)).map(res => <String> res)
            .catch(err=> this.backendService.handleError(err));

    }

    eliminarHorasExtraEmpleado(horasExtra: HorasExtraResult) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/eliminarHorasExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra.idHorasExtra)).map(res => <String> res)
            .catch(err=> this.backendService.handleError(err));

    }

    eliminarLicenciaEmpleado(licencia: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/eliminarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }

    buscarVacacionesDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaVacacionesDashboardJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <VacacionResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarIndicadorVacacionesDashboard(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaIndicadorVacacionesDashboard';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <IndicadorVacacionesResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarVacacionesDashboardRRHH(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaVacacionesDashboardRRHH';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <VacacionResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarVacacionesDashboardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaVacacioneDashboardEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <VacacionResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarHorasExtrasDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarHorasExtrasDashboardJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <HorasExtraResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarAsistenciasDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarAsistenciasDashboardJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <MarcacionResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarLicenciasDashboardJefe(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/buscarLicenciasDashboardJefe';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <LicenciaResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarHorasExtrasDashboardRRHH(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaHorasExtrasDashboardRRHH';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <HorasExtraResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    busquedaLicenciasDashboardRRHH(busquedaMarcacion: MarcacionDashboardFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaLicenciasDashboardRRHH';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <LicenciaResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarHorasExtrasDashboardEmpleado(busquedaMarcacion: MarcacionDashboardEmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/dashboard/busquedaHorasExtrasDashboardEmpledo';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion)).map(res => <HorasExtraResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }
}
