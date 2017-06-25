import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Empleado} from "../../+dto/maintenance/empleado";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {SolicitudCambioMarcacion} from "../../+dto/maintenance/solicitudCambioMarcacion";
import {ComponentBase} from "../../+common/service/componentBase";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {BackendService} from "../../+rest/backend.service";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {PermisoService} from "../../+common/service/permiso.service";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";

declare var $: any;
@Component({
    selector: 'sa-solicitar-cambio-marcacion',
    templateUrl: 'solicitar.cambio.marcacion.component.html'
})
export class SolicitarCambioMarcacionComponent extends ComponentBase implements OnInit{

    private confirmActive=false;
    public empleado:Empleado=new Empleado();
    public marcacion:Marcacion= new Marcacion();
    public solicitudCambioMarcacion:SolicitudCambioMarcacion= new SolicitudCambioMarcacion();
    public isCheckedHoraIngreso:boolean=false;
    public isCheckedHoraIniAlmuerzo:boolean=false;
    public isCheckedHoraFinAlmuerzo:boolean=false;
    public isCheckedHoraSalida:boolean=false;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    public tieneSolicitud:boolean=false;

    public historiasLaboralesActuales: HistorialLaboral[] = [];
    private defaultItemHistoriaLaboral: HistorialLaboral = new HistorialLaboral();
    private idJefeInmediatoDefault:number;
    private jefeInmediatoCombo:boolean = true;
    private messageValidation:string;

    private idMarcacion:number=0;

    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    constructor(public backendService: BackendService,private permisoService:PermisoService,
                private empleadoService:EmpleadoService,
                private _router: Router) {
        super(backendService,'GT005');

        this.defaultItemHistoriaLaboral.idJefeInmediato = null;
        this.defaultItemHistoriaLaboral.jefeInmediato = 'Seleccionar';
    }

    ngOnInit(): void {
        this.showLoading = true;
        let idEmpleado = this.currentUser.idEmpleado;
        this.idMarcacion = this.empleadoService.retrieveSessionStorage('idAsistencia');
        this.cargarInformacion(idEmpleado);


    }

    cargarInformacion(idEmpleado:number){
        this.cargarinformacionEmpelado(idEmpleado);
    }

    cargarinformacionEmpelado(idEmpleado:number){

        this.empleadoService.obtenerEmpleado(idEmpleado).subscribe(
            data => {
                this.cargarEmpleado(data);
                this.obtenerHistoriaLaborales(idEmpleado);
                this.obtenerSolicitudCambioMarcacion(this.idMarcacion);

            },
            error => {

                this.backendService.handleError(error);
            }
        );
    }

    private obtenerHistoriaLaborales(idEmpleado: number) {
        this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
            historiaLaboral => {
                this.validateDataJefeInmediato(historiaLaboral)

            },
            error =>  {
                this.backendService.notification(this.msgs, error);
            });
    }

    validateDataJefeInmediato(historialLaboral: HistorialLaboral[]){
        if(historialLaboral.length!=0){
            this.historiasLaboralesActuales = historialLaboral;
            if(historialLaboral.length == 1){
                //this.idJefeInmediatoDefault = historialLaboral[0].idJefeInmediato;
                this.solicitudCambioMarcacion.idAtendidoPor = historialLaboral[0].idJefeInmediato;
            }
        }else{
            this.jefeInmediatoCombo = false;
            this.messageValidation = "No se podra registrar la solicitud";
        }
    }

    cargarEmpleado(data:Empleado){
        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;
        if(data.fotoPerfil != null) {
            //$("#imgLogo1Subido").css("background-image", "url('data:image/jpeg;base64," + data.fotoPerfil.contenidoArchivo + "')");
            this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
            $('#iconPerson').prop("class","");
        }

    }

    private obtenerSolicitudCambioMarcacion(idMarcacion: number) {
        this.showLoading = true;
        this.empleadoService.obtenerSolicitudCambioMarcacion(idMarcacion).subscribe(
            solicitud => {
                this.cargarSolicitudCambio(solicitud);
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            });
    }

    public cargarSolicitudCambio(solicitud:SolicitudCambioMarcacion){

        this.marcacion = solicitud.marcacion;
        this.obtenerGridRegistroMarcacion();
        /*if(solicitud.tieneSolicitudCambio){
                this.tieneSolicitud = solicitud.tieneSolicitudCambio;
                this.solicitudCambioMarcacion = solicitud;
        }else{*/
            this.tieneSolicitud = solicitud.tieneSolicitudCambio;
            this.solicitudCambioMarcacion.idSolicitudCambioMarcacion = undefined;
            this.solicitudCambioMarcacion.horaIngreso = solicitud.marcacion.horaIngreso;
            this.solicitudCambioMarcacion.horaInicioAlmuerzo = solicitud.marcacion.horaInicioAlmuerzo;
            this.solicitudCambioMarcacion.horaFinAlmuerzo = solicitud.marcacion.horaFinAlmuerzo;
            this.solicitudCambioMarcacion.horaSalida = solicitud.marcacion.horaSalida;

            this.solicitudCambioMarcacion.cambiarIngreso = false;
            this.solicitudCambioMarcacion.cambiarInicioAlmuerzo= false;
            this.solicitudCambioMarcacion.cambiarFinAlmuerzo = false;
            this.solicitudCambioMarcacion.cambiarSalida = false;
        //}

    }

    onRegresarBusquedaMarcacion(){
        this.empleadoService.storeSessionStorage('idAsistencia',undefined);
        this._router.navigate(['/autogestion/consultarAsistencia']);
    }

    private onRegistrarSolicitudCorreccionMarcacion(){

        if(this.solicitudCambioMarcacion.idAtendidoPor === undefined || this.solicitudCambioMarcacion.idAtendidoPor == null){
            $('#idAtendidoPor').addClass('invalid').removeClass('required');
            $('#idAtendidoPor').parent().addClass('state-error').removeClass('state-success');
            $('#idAtendidoPor').css('border','2px solid red');
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        if(this.solicitudCambioMarcacion.cambiarIngreso){

            if(this.solicitudCambioMarcacion.horaIngreso == undefined ||
                this.solicitudCambioMarcacion.horaIngreso == null || this.solicitudCambioMarcacion.horaIngreso == '') {
                $('#horaIngreso').parent().addClass('state-error').removeClass('state-success');
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
                return;
            }

        }

        if(this.solicitudCambioMarcacion.cambiarInicioAlmuerzo){

            if(this.solicitudCambioMarcacion.horaInicioAlmuerzo == undefined ||
                this.solicitudCambioMarcacion.horaInicioAlmuerzo == null || this.solicitudCambioMarcacion.horaInicioAlmuerzo == '') {
                $('#horaInicioAlmuerzo').parent().addClass('state-error').removeClass('state-success');
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
                return;
            }

        }

        if(this.solicitudCambioMarcacion.cambiarFinAlmuerzo){

            if(this.solicitudCambioMarcacion.horaFinAlmuerzo == undefined ||
                this.solicitudCambioMarcacion.horaFinAlmuerzo == null || this.solicitudCambioMarcacion.horaFinAlmuerzo == '') {
                $('#horaFinAlmuerzo').parent().addClass('state-error').removeClass('state-success');
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
                return;
            }

        }

        if(this.solicitudCambioMarcacion.cambiarSalida){

            if(this.solicitudCambioMarcacion.horaSalida == undefined ||
                this.solicitudCambioMarcacion.horaSalida == null || this.solicitudCambioMarcacion.horaSalida == '') {
                $('#horaSalida').parent().addClass('state-error').removeClass('state-success');
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
                return;
            }

        }

        this.solicitudCambioMarcacion.marcacion = this.marcacion;

        this.solicitudCambioMarcacion.idMarcacion = this.idMarcacion;
        this.showLoading = true;
        this.empleadoService.solicitarCambioMarcacion(this.solicitudCambioMarcacion).subscribe(
            (data:NotificacionResult) => {
                this.backendService.notification(this.msgs, data);
                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarDashborad(data);
                    }, 2000);
                }
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    navegarDashborad(data:NotificacionResult){
        this.empleadoService.storeSessionStorage('isNewMarcacion',true);
        this.empleadoService.storeSessionStorage('idMarcacion',undefined);
        this._router.navigate(['/autogestion/consultarAsistencia']);

    }

    cambiarHoraIngreso(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedHoraIngreso = isChecked;
    }

    cambiarHoraIniAlmuerzo(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedHoraIniAlmuerzo = isChecked;
    }

    cambiarHoraFinAlmuerzo(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedHoraFinAlmuerzo = isChecked;
    }

    cambiarHoraSalida(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedHoraSalida = isChecked;
    }

    onChangeHoraIngreso(value){
        this.solicitudCambioMarcacion.horaIngreso = value;
    }

    onChangeHoraInicioAlmuerzo(value){
        this.solicitudCambioMarcacion.horaInicioAlmuerzo = value;
    }

    onChangeHoraFinAlmuerzo(value){
        this.solicitudCambioMarcacion.horaFinAlmuerzo = value;
    }

    onChangeHoraSalida(value){
        this.solicitudCambioMarcacion.horaSalida = value;
    }

    private  gridViewRegistroMarcacion: GridDataResult;

    private pageSizeRegistroMarcacion: number = 5;
    private skipRegistroMarcacion: number = 0;


    public obtenerGridRegistroMarcacion():void{

        if(this.marcacion.registrosMarcaciones.length>0){
            this.gridViewRegistroMarcacion= {
                data: this.marcacion.registrosMarcaciones.slice(this.skipRegistroMarcacion, this.skipRegistroMarcacion + this.pageSizeRegistroMarcacion),
                total: this.marcacion.registrosMarcaciones.length
            };
        }else{
            this.gridViewRegistroMarcacion = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeRegistroMarcacion(event: PageChangeEvent): void {
        this.skipRegistroMarcacion = event.skip;
        this.obtenerGridRegistroMarcacion();
    }

    public verSolicitudCambio(){
        this.confirmActive= true;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    public onCloseDetalleSolicitud() {
        this.closeForm();
    }
    public closeForm(){
        this.confirmActive= false;
    }

    selectJefeInmediatoPermiso(){
        $('#idAtendidoPor').css('border','none');
    }

    ingresaHoraIngreso(){
        $('#horaIngreso').parent().removeClass('state-error');
    }

    ingresaHoraInicioAlmuerzo(){
        $('#horaInicioAlmuerzo').parent().removeClass('state-error');
    }

    ingresaHoraSalida(){
        $('#horaSalida').parent().removeClass('state-error');
    }

    ingresaHoraFinAlmuerzo(){
        $('#horaFinAlmuerzo').parent().removeClass('state-error');
    }

}
