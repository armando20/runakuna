import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Empleado} from "../../+dto/maintenance/empleado";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisService} from "../../+common/service/pais.service";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {HorarioEmpleado} from "../../+dto/maintenance/horarioEmpleado";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {MarcacionesDialogFormComponent} from "./marcaciones.dialog.component";
import {ComponentBase} from "../../+common/service/componentBase";
import {VacacionService} from "../../+common/service/vacacion.service";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {LicenciaService} from "../../+common/service/licencia.service";
import {MarcacionFilter} from "../../+dto/marcacionFilter";

import {ExpressionRegularValidate} from "../../+common/Utils/expressionRegularValidate";
import {BackendService} from "../../+rest/backend.service";
import {SolicitudCambioMarcacion} from "../../+dto/maintenance/solicitudCambioMarcacion";
import {Router} from "@angular/router";

declare var $: any;

var moment = require('moment');

@Component({
    selector: 'sa-consultar-asistencia',
    templateUrl: 'consultar.asistencia.component.html',
    providers: [PaisService,VacacionService,HorasExtraService,LicenciaService],
})
export class ConsultarAsistenciaComponent extends ComponentBase implements OnInit,OnDestroy {

    private empleado:Empleado = new Empleado();
    private marcaciones:Marcacion[]=[];
    private horariosEmpleado:HorarioEmpleado=new HorarioEmpleado();
    private fechaDesde:string;
    private fechaHasta:string;
    private marcacionFilter: MarcacionFilter = new MarcacionFilter();
    private tiempoTrabajado:string;
    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    constructor(private empleadoService:EmpleadoService,private _router: Router,
                public backendService: BackendService) {

        super(backendService,'AU001');
    }

    ngOnInit() {
        this.showLoading = true;
        let idEmpleado = this.currentUser.idEmpleado;

        let indicadorDashboardEmpleado:string = this.empleadoService.retrieveSessionStorage('indicadorDashboardEmpleado');
        if(indicadorDashboardEmpleado === 'indicadorEmpleado'){
            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            this.fechaDesde = moment(firstDay).format('DD/MM/YYYY');
            this.fechaHasta = moment().format('DD/MM/YYYY');
        }else{
            this.inicializarCampos();
        }
        this.cargarInformacion(idEmpleado);

    }

    ngOnDestroy(): void {
        sessionStorage.removeItem('indicadorDashboardEmpleado');
    }

    inicializarCampos(){
        this.fechaDesde = moment().subtract(7, 'days').format('DD/MM/YYYY');
        this.fechaHasta = moment().format('DD/MM/YYYY');
    }

    cargarInformacion(idEmpleado:number){
        this.cargarinformacionEmpelado(idEmpleado);
        this.verMarcaciones(idEmpleado);
        this.verHorarioEmpleado(idEmpleado);
    }

    cargarinformacionEmpelado(idEmpleado:number){
        this.verEmpleado(idEmpleado);
    }

    verEmpleado(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.obtenerEmpleado(idEmpleado).subscribe(
            data => this.cargarEmpleado(data),
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }

    verMarcaciones(idEmpleado: number){
        this.marcacionFilter.idEmpleado = idEmpleado;
        this.marcacionFilter.desde = this.fechaDesde;
        this.marcacionFilter.hasta = this.fechaHasta;
        this.cargarMarcacion(this.marcacionFilter);

    }
    verHorarioEmpleado(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.verHorarioEmpleado(idEmpleado).subscribe(
            data => {
                this.horariosEmpleado = data;
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
    }

    cargarMarcacion(filter:MarcacionFilter){
        this.showLoading = true;
        this.empleadoService.getMarcacionesByFiltro(filter).subscribe(
            data => {this.marcaciones = data;
                this.obtenerGridMarcaciones();
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
    }

    onChangeDateDesde(value){

        if(value.type == 'change'){
            return;
        }
        let validateFormat = value ===undefined ? true : ExpressionRegularValidate.isValidateDateInput(value);
        if(validateFormat){
            this.marcacionFilter.desde = value;
            this.cargarMarcacion(this.marcacionFilter);
        }else{
            this.msgs.push({severity:'error', summary:'Ingrese una Fecha Inicio valida', detail:'Runakuna Error'});
            return;
        }
    }

    onChangeDateHasta(value){
        if(value.type == 'change'){
            return;
        }
        let validateFormat = value ===undefined ? true : ExpressionRegularValidate.isValidateDateInput(value);
        if(validateFormat){
            this.marcacionFilter.hasta = value;
            this.cargarMarcacion(this.marcacionFilter);
        }else{
            this.msgs.push({severity:'error', summary:'Ingrese una Fecha Inicio valida', detail:'Runakuna Error'});
            $('#datepickerHasta').parent().addClass('state-error').removeClass('state-success');
            return;
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

        this.empleado = data;

        if(data.fechaIngreso != null && data.fechaIngreso != '') {

            let fechaInicioCadena: string[] = data.fechaIngreso.split('/');
            let fechaIni: Date = new Date(parseInt(fechaInicioCadena[2]), parseInt(fechaInicioCadena[1]) - 1, parseInt(fechaInicioCadena[0]));

            let fechaFin: Date = new Date();

            this.duration(fechaIni, fechaFin);
        }

        this.empleado.edad = this.calculateAge(this.empleado.fechaNacimiento);
        this.showLoading = false;
    }

    //marcacion
    public dataItemMarcacion: Marcacion;

    private gridViewMarcaciones: GridDataResult;

    private pageSizeMarcaciones: number = 10;
    private skipMarcaciones: number = 0;

    @ViewChild(MarcacionesDialogFormComponent) protected editMarcacionesFormComponent: MarcacionesDialogFormComponent;


    public onSolicitarCambio(data: Marcacion): void {
        this.empleadoService.storeSessionStorage('idAsistencia',data.idMarcacion);
        this._router.navigate(['/autogestion/solicitarCambioMarcacion']);
    }

    public onEditarMarcaciones(dataItem: Marcacion): void {
        this.dataItemMarcacion = dataItem;

        this.editMarcacionesFormComponent.incializarSolicitud();

        this.editMarcacionesFormComponent.nombreEmpleado = this.dataItemMarcacion.nombreCompletoEmpleado;
        this.editMarcacionesFormComponent.fechaMarcacion = this.dataItemMarcacion.fecha;
        this.editMarcacionesFormComponent.horaIngreso = this.dataItemMarcacion.horaIngreso;
        this.editMarcacionesFormComponent.horaInicioAlmuerzo = this.dataItemMarcacion.horaInicioAlmuerzo;
        this.editMarcacionesFormComponent.horaFinAlmuerzo = this.dataItemMarcacion.horaFinAlmuerzo;
        this.editMarcacionesFormComponent.horaSalida = this.dataItemMarcacion.horaSalida;
        this.editMarcacionesFormComponent.idEmpleado = this.dataItemMarcacion.idEmpleado;

        if(this.dataItemMarcacion.solicitudCambio == 'No'){

            this.editMarcacionesFormComponent.horaIngresoSolicitud = this.dataItemMarcacion.horaIngreso;
            this.editMarcacionesFormComponent.horaInicioAlmuerzoSolicitud = this.dataItemMarcacion.horaInicioAlmuerzo;
            this.editMarcacionesFormComponent.horaFinAlmuerzoSolicitud = this.dataItemMarcacion.horaFinAlmuerzo;
            this.editMarcacionesFormComponent.horaSalidaSolicitud = this.dataItemMarcacion.horaSalida;

            this.editMarcacionesFormComponent.tieneSolicitud = false;
        }else{
            let solicitud:SolicitudCambioMarcacion = new SolicitudCambioMarcacion();

            solicitud = this.dataItemMarcacion.solicitudesCambioMarcacion[0];

            this.editMarcacionesFormComponent.horaIngresoSolicitud = solicitud.horaIngreso;
            this.editMarcacionesFormComponent.horaInicioAlmuerzoSolicitud = solicitud.horaInicioAlmuerzo;
            this.editMarcacionesFormComponent.horaFinAlmuerzoSolicitud = solicitud.horaFinAlmuerzo;
            this.editMarcacionesFormComponent.horaSalidaSolicitud = solicitud.horaSalida;

            this.editMarcacionesFormComponent.cambiarIngreso = solicitud.cambiarIngreso;
            this.editMarcacionesFormComponent.cambiarInicioAlmuerzo = solicitud.cambiarInicioAlmuerzo;
            this.editMarcacionesFormComponent.cambiarFinAlmuerzo = solicitud.cambiarFinAlmuerzo;
            this.editMarcacionesFormComponent.cambiarSalida = solicitud.cambiarSalida;

            this.editMarcacionesFormComponent.razonCambioHoraIngreso = solicitud.razonCambioHoraIngreso;
            this.editMarcacionesFormComponent.razonCambioHoraInicioAlmuerzo = solicitud.razonCambioHoraInicioAlmuerzo;
            this.editMarcacionesFormComponent.razonCambioHoraFinAlmuerzo = solicitud.razonCambioHoraFinAlmuerzo;
            this.editMarcacionesFormComponent.razonCambioHoraSalida = solicitud.razonCambioHoraSalida;

            this.editMarcacionesFormComponent.tieneSolicitud = true;
        }

    }

    public onCancelaSolicitudCambio(): void {
        this.dataItemMarcacion = undefined;
    }

    public onAgregarSolicitudCambio(dto: Marcacion): void {
        this.cargarMarcacion(this.marcacionFilter);
    }

    public onEliminarMarcacion(e: Marcacion): void {
        const operation = this.eliminarMarcaciones(e);
        this.cargarMarcacion(this.marcacionFilter);
    }


    public editarMarcaciones(data: Marcacion): Observable<Marcacion[]> {
        return this.fetchMarcaciones("update", data);
    }


    public eliminarMarcaciones(data: Marcacion): Observable<Marcacion[]> {
        return this.fetchMarcaciones("destroy", data);
    }

    private fetchMarcaciones(action: string = "", data?: Marcacion): Observable<Marcacion[]>  {

        if(action=="update"){
            var indice = this.marcaciones.indexOf(data);
            if(indice>=0)
                this.marcaciones[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.marcaciones.indexOf(data);

            if(indice>=0)
                this.marcaciones.splice(indice, 1);

        }

        return Observable.of(this.marcaciones);
    }

    obtenerGridMarcaciones():void{
        if(this.marcaciones.length>0){
            //this.isEmpty=false;
            this.gridViewMarcaciones = {
                data: this.marcaciones.slice(this.skipMarcaciones, this.skipMarcaciones + this.pageSizeMarcaciones),
                total: this.marcaciones.length
            };
        }else{
            //this.isEmpty=true;
            this.gridViewMarcaciones = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeMarcaciones(event: PageChangeEvent): void {
        this.skipMarcaciones = event.skip;
        this.obtenerGridMarcaciones();

    }


    //calculo tiempo en letras
    private duration(fechaInicio:Date, fechaFin:Date) {

        let years:number=0;
        let months:number=0;
        let days:number=0;


        if (fechaInicio >= fechaFin) {
            this.tiempoTrabajado = undefined;
            return;
        }

        fechaFin.setHours(0);
        fechaFin.setMinutes(0);
        fechaFin.setSeconds(0);

        //anios
        if(fechaFin.getFullYear() > fechaInicio.getFullYear()){
            years = (fechaFin.getFullYear() - fechaInicio.getFullYear());
        }

        if(fechaInicio.getMonth() == fechaFin.getMonth()){
            if(fechaInicio.getDate()> fechaFin.getDate()){
                years = years - 1;
            }
        }

        if(fechaInicio.getMonth() > fechaFin.getMonth()){
            years = (years - 1);
        }

        //Meses

        if(fechaInicio.getFullYear() == fechaFin.getFullYear()) {
            if(fechaFin.getMonth() > fechaInicio.getMonth()){
                months = fechaFin.getMonth() - fechaInicio.getMonth();
                if(fechaFin.getDate() < fechaInicio.getDate()){
                    months = months -1;
                }

            }
        }else{

            if(fechaFin.getMonth() > fechaInicio.getMonth()){
                months = fechaFin.getMonth() - fechaInicio.getMonth();
            }else if(fechaFin.getMonth() == fechaInicio.getMonth()){
                if(fechaFin.getDate() >= fechaInicio.getDate()){
                    months = fechaFin.getMonth() - fechaInicio.getMonth();
                }else {
                    months = 11;
                }
            }else {
                months = 12 - fechaInicio.getMonth() + fechaFin.getMonth();
                if(fechaFin.getDate() < fechaInicio.getDate()){
                    months = months -1;
                }
            }
        }

        //dias
        if(fechaFin.getMonth() == fechaInicio.getMonth()){
            if(fechaFin.getDate() > fechaInicio.getDate()){
                days = fechaFin.getDate() - fechaInicio.getDate();
            }

        }else if(fechaFin.getDate() < fechaInicio.getDate()){
            let fechaCal:Date= new Date(fechaInicio.getFullYear(),fechaInicio.getMonth(),fechaInicio.getDate());
            fechaCal.setMonth(fechaCal.getMonth() + months);
            fechaCal.setDate(fechaCal.getDate()+1);

            //if(fechaFin.getDate() < fechaInicio.getDate()) {

            let interval = fechaFin.getTime() - fechaCal.getTime();
            days = interval / (1000 * 60 * 60 * 24);
            //}
        }else{
            days = fechaFin.getDate() - fechaInicio.getDate();
        }

        let duracion:string='';
        let concat:string='';



        if(years == 1){
            duracion = years+' a\u00f1o ';
        }else if(years > 1){
            duracion = years+' a\u00f1os ';
        }

        if(months == 1){
            duracion = duracion+months+' mes ';
        }else if(months > 1){
            duracion = duracion+months+' meses ';
        }

        if(days == 1){
            duracion = duracion + parseInt(days.toString()) + ' d\u00EDa';
        }else if(days > 1){
            duracion = duracion + parseInt(days.toString()) + ' d\u00EDas';
        }

        this.tiempoTrabajado = duracion;

    }





}
