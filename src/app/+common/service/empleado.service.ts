import {Injectable} from "@angular/core";
import {CentroCostoDto} from "../../+personal/+empleado/centroCostoDto";
import {Empleado} from "../../+dto/maintenance/empleado";
import {EmpleadoFilter} from "../../+dto/empleadoFilter";
import "rxjs/Rx";
import {Permiso} from "../../+dto/maintenance/permiso";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {Educacion} from "../../+dto/maintenance/educacion";
import {ExperienciaLaboral} from "../../+dto/maintenance/experienciaLaboral";
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";
import {Dependiente} from "../../+dto/maintenance/dependiente";
import {Licencia} from "../../+dto/maintenance/licencia";
import {HorarioEmpleado} from "../../+dto/maintenance/horarioEmpleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import "rxjs/add/operator/toPromise";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {MarcacionFilter} from "../../+dto/marcacionFilter";
import {HorarioFilter} from "../../+dto/horarioFilter";
import {Horario} from "../../+dto/maintenance/horario";
import {HorarioDia} from "../../+dto/maintenance/horarioDia";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {HorarioEmpleadoDia} from "../../+dto/maintenance/horarioEmpleadoDia";
import {LocalStorageGlobal} from "../../+dto/localStorageDto";
import {SolicitudCambioMarcacion} from "../../+dto/maintenance/solicitudCambioMarcacion";
import {AlertaEmpleado} from "../../+dto/maintenance/alertaEmpleado";
import {Moneda} from "../../+dto/maintenance/moneda";
import {Contrato} from "../../+dto/maintenance/contrato";
import {ProyectoFilter} from "../../+dto/proyectoFilter";
import {CargoFilter} from "../../+dto/cargoFilter";
import {Cargo} from "../../+dto/maintenance/cargo";
import {ReporteMarcacion} from "../../+dto/maintenance/reporteMarcacion";
import {AlertaFilter} from "../../+dto/alertaFilter";
import {Alerta} from "../../+dto/maintenance/alerta";
import {AlertaResult} from "../../+dto/alertaResult";
import {ReporteMarcacionFilter} from "../../+dto/reporteMarcacionFilter";
import {ReporteMarcacionResult} from "../../+dto/reporteMarcacionResult";
import {HorarioEmpleadoResult} from "../../+dto/horarioEmpleadoResult";
import {ProyectoResult} from "../../+dto/proyectoResult";
import {EmpleadoResult} from "../../+dto/empleadoResult";
import {EmpleadoQuickFilter} from "../../+dto/empleadoQuickFilter";
import {MarcacionQuickFilter} from "../../+dto/marcacionQuickFilter";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {CurrentUser} from "../../+dto/currentUser";
import {MarcacionResult} from "../../+dto/marcacionResult";
import {EmpleadoCabecera} from "../../+dto/maintenance/empleadoCabecera";
import {DirectorioEmpleado} from "../../+dto/maintenance/directorioEmpleado";

@Injectable()
export class EmpleadoService {


    private tablaGeneralUrl: string = '/api/tablaGeneral/';
    private tipoLicenciaUrl = '/api/licenciaEmpleado/obtenerTipoLicencia';

    empleado: Empleado = new Empleado();
    permisos: Permiso = new Permiso();
    vacacion: Vacacion = new Vacacion();
    horasExtra: HorasExtra = new HorasExtra();
    //private rolNames: Array<RoleNameDto> = [];

    horario:Horario = new Horario();

    marcacion:Marcacion = new Marcacion();

    cargo:Cargo = new Cargo();

    horarioEmpleado:HorarioEmpleado = new HorarioEmpleado();
    contrato:Contrato = new Contrato();


    localStorageValue: LocalStorageGlobal = new LocalStorageGlobal();
    private registrarCargoUrl = '/api/cargo/registrarCargo';
    private eliminarCargoUrl = '/api/cargo/eliminarCargo';
    protected currentUser: CurrentUser;

    constructor(private backendService: BackendService) {
    }

    /*private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }*/

    obtenerHorasSemanalesPendientes(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/obtenerHorasSemanalesPendientes';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HorasExtra> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    obtenerComboCentroCosto() {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/centroCosto/obtenerCentrosCosto';
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <CentroCostoDto[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    buscarEmpleado(busquedaEmpleado: EmpleadoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/busquedaEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaEmpleado)).map(res => <EmpleadoResult[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    busquedaRapidaEmpleado(quickFilter: EmpleadoQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/busquedaRapidaEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    busquedaDirectorioEmpleado(quickFilter: EmpleadoQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/busquedaDiretorioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter)).map(res => <DirectorioEmpleado[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    registrarEmpleado(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/registrarEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    obtenerEmpleadoPorCodigo(empleado: Empleado){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEmpleadoPorCodigo';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <Empleado> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    registrarFotoEmpleado(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/registrarFotoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    eliminarEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/eliminarEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    registrarHorario(horario: Horario) {
        
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/registrarHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    registrarCargo(cargo: Cargo) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarCargoUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(cargo)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    eliminarHorario(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/eliminarHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario)).map(res => <String> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    eliminarCargo(idCargo: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarCargoUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idCargo)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );


    }

    registrarCorreccionMarcacion(solicitudCambioMarcacion: SolicitudCambioMarcacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/registrarCorreccionMarcacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(solicitudCambioMarcacion))
            .map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    solicitarCambioMarcacion(solicitudCambioMarcacion: SolicitudCambioMarcacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/solicitarCambioMarcacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(solicitudCambioMarcacion))
            .map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    aprobarCorreccionMarcacion(solicitudCambioMarcacion: SolicitudCambioMarcacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/aprobarSolicitud';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(solicitudCambioMarcacion))
            .map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    rechazarCorreccionMarcacion(solicitudCambioMarcacion: SolicitudCambioMarcacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/rechazarSolicitud';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(solicitudCambioMarcacion))
            .map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    obtenerHorario(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario)).map(res => <Horario> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    obtenerContratoEmpleado(contrato: Contrato) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/obtenerContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(contrato)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    registrarHorarioEmpleado(horarioEmpleado: HorarioEmpleado) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/registrarHorarioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horarioEmpleado)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    registrarContratoEmpleado(contrato: Contrato) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/registrarContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(contrato)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    aprobarContratoEmpleado(contrato: Contrato) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/aprobarContrato';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(contrato)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    actualizarDatosPersonalesEmpleado(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/actualizarDatosPersonales';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <NotificacionResult> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    obtenerEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Empleado> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    obtenerEmpleadoCabecera(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEmpleadoCabecera';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <EmpleadoCabecera> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verEmpleado(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado)).map(res => <Empleado> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verDocumentos(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verDocumentos';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <DocumentoEmpleado[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verDocumentosSF(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verDocumentosSF';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <DocumentoEmpleado[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verEducacion(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verEducacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Educacion[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verExperienciaLaboral(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verExperienciaLaboral';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <ExperienciaLaboral[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verEquipoEntregado(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verEquipoEntregado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <EquipoEntregado[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verDependiente(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verDependiente';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Dependiente[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verLicencia(periodoEmpleado: PeriodoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado)).map(res => <Licencia[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verMarcaciones(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verMarcaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Marcacion[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    getMarcacionesByFiltro(filter: MarcacionFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/getMarcacionesByFiltro';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(filter)).map(res => <Marcacion[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    verHorarioEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verHorarioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HorarioEmpleado> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verHorariosEmpleado(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verHorariosEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HorarioEmpleadoResult[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verContratosEmpleado(idEmpleado: number) {


        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/contrato/obtenerContratosPorEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Contrato[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verHistoriaLaboral(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verHistoriaLaboral';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <HistorialLaboral[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verPeriodoEmpleado(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verPeriodoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <PeriodoEmpleado[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    verPermisoEmpleado(periodoEmpleado: PeriodoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/verPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado)).map(res => <PermisoEmpleado[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verVacaciones(periodoEmpleado: PeriodoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/verVacaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(periodoEmpleado)).map(res => <Vacacion[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    verCargo(cargo: Cargo) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/cargo/obtenerCargoDetalle';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(cargo)).map(res => <Cargo> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    obtenerHorariosPorTipoHorario(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorariosPorTipoHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario)).map(res => <Horario[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    obtenerHorarios() {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorarios';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions).map(res => <Horario[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    obtenerHorarioPorTipoHorarioPorDefecto(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorarioPorTipoHorarioPorDefecto';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario))
            .map(res => <Horario> res)
            .catch( err=>
                this.backendService.handleError(err)
            );


    }

    obtenerHorarioDiaPorHorario(horario: Horario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/obtenerHorarioDiaPorHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horario))
            .map(res => <HorarioDia[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    obtenerHorarioEmpleadoDiaPorHorarioEmpleado(horarioEmpleado: HorarioEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerHorarioEmpleadoDiasPorHorarioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horarioEmpleado))
            .map(res => <HorarioEmpleadoDia[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );

    }

    obtenerMoneda(){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerHorarioEmpleadoDiasPorHorarioEmpleado';
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions)
            .map(res => <Moneda[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    storeDataHorasExtra(horasExtra: HorasExtra){
        this.horasExtra = horasExtra;
    }

    buscarMarcacionesEmpleado(busquedaMarcacion: MarcacionFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/busquedaMarcacionesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaMarcacion))
            .map(res => <MarcacionResult[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    busquedaRapidaMarcaciones(quickFilter: MarcacionQuickFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/busquedaRapidaMarcacionesEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <Marcacion[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    buscarProyectos(busquedaProyectos: ProyectoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/proyecto/obtenerProyectos';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaProyectos))
            .map(res => <ProyectoResult[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    buscarCargos(busquedaCargos: CargoFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/cargo/obtenerCargos';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaCargos))
            .map(res => <Cargo[]> res)
            .catch( err=>
                this.backendService.handleError(err)
            );
    }

    buscarHorarios(busquedaHorario: HorarioFilter) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horario/busquedaHorario';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaHorario))
            .map(res => <Horario[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerMarcacionEmpleado(empleado: Empleado){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerMarcacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <Marcacion> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerSolicitudCambioMarcacion(idMarcacion: number){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/marcacion/obtenerSolicitudCambio';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idMarcacion))
            .map(res => <SolicitudCambioMarcacion> res)
            .catch(err=> this.backendService.handleError(err));
    }

    eliminarPermisoEmpleado(permisos: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/eliminarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisos))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }

    aprobarPermisoEmpleado(permisos: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/aprobarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisos))
            .map(res => <String> res)
            .catch(err=> this.backendService.handleError(err));

    }

    rechazarPermisoEmpleado(permisos: PermisoEmpleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/permisoEmpleado/rechazarPermisoEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(permisos))
            .map(res => <String> res)
            .catch(err=> this.backendService.handleError(err));

    }

    /* ADMINISTRAR VACACIONES */
    registrarVacaciones(agendarVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/registrarVacaciones';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(agendarVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=>
                this.backendService.handleError(err)
            );
    }

    regularizarVacacion(agendarVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/regularizarVacacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(agendarVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    comprarVacacion(agendarVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/comprarVacacion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(agendarVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    actualizarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/actualizarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }

    enviarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/enviarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    eliminarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/eliminarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }
    incluirPlanillaVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/incluirVacacionEmpleadoAPlanilla';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }
    devolverVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/devolverVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    aprobarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/aprobarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    rechazarVacacionEmpleado(adminVacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/rechazarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(adminVacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    actualizarDatosPersonalesVacaciones(vacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/actualizarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(vacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }



    enviarDatosPersonalesVacaciones(vacacion: Vacacion) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/vacacionEmpleado/enviarVacacionEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(vacacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    /** ADMINISTRAR HORAS EXTRAS */

    actualizarDatosPersonalesHorasExtras(horaExtra: HorasExtra) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/actualizarHoraExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horaExtra))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }


    registrarHorasExtra(horasExtra: HorasExtra){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/registrarHorasExtra';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra))
            .map(res => <NotificacionResult> res)
            //.map(res => <String> res)
            .catch(err=> this.backendService.handleError(err));

    }

    eliminarHorasExtraEmpleado(idHorasExtra: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/horasExtra/eliminarHorasExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idHorasExtra))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }
    aprobarHorasExtraEmpleado(horasExtra: HorasExtra) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/aprobarHorasExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    rechazarHorasExtraEmpleado(horasExtra: HorasExtra) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/rechazarHorasExtraEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(horasExtra))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    /**DAR DE BAJA */
    obtenerEquiposPendientesDevolucion(idEmpleado: number){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEquiposPendientesDevolucion?idEmpleado='+idEmpleado;
        return this.backendService.AuthRequest(RequestTypes.get, urlOptions)
            .map(res => <EquipoEntregado[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    countEquiposPendientes(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/countEquiposPendientesDevolucion';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    registrarDarBajaEmpleado(empleado: Empleado) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/registrarDarBajaEmpleado';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleado))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    eliminarLicenciaEmpleado(licencia: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/eliminarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }
    guardarLicenciaEmpleado(licencia: Licencia) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/registrarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    aprobarLicenciaEmpleado(licencia: Licencia) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/aprobarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    validarLicenciaEmpleado(licencia: Licencia) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/licenciaEmpleado/validarLicencia';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(licencia))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    /* ALERTAS*/
    obtenerMensajeAlertaEmpleado(empleadoDto: Empleado) {

        let url = '/api/alerta/obtenerMensajeAlerta';
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = url;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(empleadoDto))
            .map(res => <AlertaEmpleado[]> res)
            .catch(err=> this.backendService.handleError(err));
    }


    obtenerAlertaById(idAlerta: any) {

        let url = '/api/alerta/obtenerAlertaDetalle';
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = url;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idAlerta))
            .map(res => <Alerta> res)
            .catch(err=> this.backendService.handleError(err));

    }
    buscarAlertas(busquedaAlertas: AlertaFilter) {

        let url = '/api/alerta/obtenerAlertas';
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = url;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaAlertas))
            .map(res => <AlertaResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    guardarAlerta(alerta: Alerta) {

        let url = '/api/alerta/registrarAlerta';
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = url;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(alerta))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }

    /* REPORTE MARCACIONES */
    obtenerReporteMarcacionById(idReporteMarcacion: any) {
        let busquedaDetalleUrl = '/api/reporteMarcacion/obtenerReporteMarcacionDetalle';

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = busquedaDetalleUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idReporteMarcacion))
            .map(res => <ReporteMarcacion> res)
            .catch(err=> this.backendService.handleError(err));
    }
    buscarReporteMarcaciones(busquedaMarcacion: ReporteMarcacionFilter) {

        let busquedaUrl = '/api/reporteMarcacion/obtenerReportesMarcacion';

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = busquedaUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,busquedaMarcacion)
            .map(res => <ReporteMarcacionResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    buscarSubscriptores(reporteMarcacion: ReporteMarcacion) {

        let busquedaSubscriptoresUrl = '/api/reporteMarcacion/obtenerSubscriptoresReportesMarcacion';

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = busquedaSubscriptoresUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,reporteMarcacion)
            .map(res => <ReporteMarcacionResult[]> res)
            .catch(err=> this.backendService.handleError(err));

    }

    guardarReporteMarcacion(reporteMarcacion: ReporteMarcacion) {

        let registrarUrl = '/api/reporteMarcacion/registrarReporteMarcacion';

        this.currentUser = JSON.parse(localStorage.getItem("sessionId") || '{}');

        reporteMarcacion.idEmpresa=this.currentUser.idEmpresa;

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = registrarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(reporteMarcacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    eliminarReporteMarcacion(reporteMarcacion: ReporteMarcacion) {
        let eliminarUrl = '/api/reporteMarcacion/eliminarReporteMarcacion';

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = eliminarUrl;
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(reporteMarcacion))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    /**SESSION STORAGE*/
    storeSessionStorage(valueStore: string, dataVal: any){
        sessionStorage.setItem(valueStore,JSON.stringify(dataVal));
    }
    retrieveSessionStorage(valueRetrieve: string){
        return JSON.parse(sessionStorage.getItem(valueRetrieve) || '{}');
    }
    storeSessionStorageState(valueStore: string, dataVal: any){
        sessionStorage.setItem(valueStore,dataVal);
    }

    obtenerEmpleadoEsPersonalConfianza(idEmpleado: number) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/api/empleado/obtenerEmpleadoEsPersonalConfianza';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado)).map(res => <Empleado> res)
            .catch(err=> this.backendService.handleError(err));

    }
}