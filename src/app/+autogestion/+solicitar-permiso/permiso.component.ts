import {Component, OnInit} from "@angular/core";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {Empleado} from "../../+dto/maintenance/empleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {ComponentBase} from "../../+common/service/componentBase";
import {Router} from "@angular/router";
import {BackendService} from "../../+rest/backend.service";
import {EmpleadoCompensacionResult} from "../../+dto/empleadoCompensacionResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {EmpleadoCabecera} from "../../+dto/maintenance/empleadoCabecera";
import {GridDataResult} from "@progress/kendo-angular-grid";
import {FormControl, FormGroup} from "@angular/forms";
import {PermisoEmpleadoRecuperacion} from "../../+dto/maintenance/permisoEmpleadoRecuperacion";

declare var $: any;
var moment = require('moment');

@Component({
    selector: 'solicitar-permiso',
    templateUrl: 'solicitar.permiso.component.html'
})
export class PermisoComponent extends ComponentBase implements OnInit {

    public defaultItemTipoPermiso:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
    empleadoCompensacion: EmpleadoCompensacionResult = new EmpleadoCompensacionResult();

    private motivos:TablaGeneralResult[];
    permisoEmpleado:PermisoEmpleado = new PermisoEmpleado();
    isCompensarhoras:boolean=false;
    isPersonal:boolean=false;
    private empleado:Empleado = new Empleado();
    private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();

    historiasLaboralesActuales: HistorialLaboral[] = [];
    private jefeInmediatoCombo:boolean = true;
    private messageValidation:string;

    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    es:any  = {firstDayOfWeek: 1,
        dayNames:["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"],
        dayNamesShort:["Dom","Lun","Mar","Mie","Jue","Vie","Sab"],
        dayNamesMin:["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
        monthNames:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"],
        monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Set","Oct","Nov","Dic"]
    };

    private defaultItemHistoriaLaboral: HistorialLaboral = new HistorialLaboral();
    private idJefeInmediatoDefault:number;
    private confirmActive=false;
    gridViewPermisoPersonal: GridDataResult;
    pageSizePermisoPersonal: number = 10;
    skipPermisoPersonal: number = 0;
    //private permisosPersonales: {fechaRecuperacion:string,desde:string,hasta:string,horas:string} = {fechaRecuperacion:null,desde:null,hasta:null,horas:null};
    private permisosPersonales: Array<PermisoEmpleadoRecuperacion>=[];


    constructor(public backendService: BackendService,private empleadoService:EmpleadoService,
                private _router: Router,
                private permisoService:PermisoService) {
        super(backendService,'AU002');
    }

    ngOnInit() {
        this.defaultItemHistoriaLaboral.idJefeInmediato = null;
        this.defaultItemHistoriaLaboral.jefeInmediato = 'Seleccionar';
        this.empleado.idEmpleado = this.currentUser.idEmpleado;
        let idEmpleado = this.currentUser.idEmpleado;

        this.permisoEmpleado.diaEntero = false;
        this.obtenerEmpleado(idEmpleado);

        this.obtenerHistoriaLaborales(idEmpleado);
        this.obtenerPeriodoEmpleadoActual(this.empleado);
        this.getMotivosPermiso();
        this.getHorasPorCompensar(this.empleado.idEmpleado);
    }

    obtenerEmpleado(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.obtenerEmpleadoCabecera(idEmpleado).subscribe(
            data => {
                this.cargarEmpleado(data);
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    cargarEmpleado(data:EmpleadoCabecera){

        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;

        if(data.fotoPerfil != null) {
            this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px 0 0; height: 100px");
            $('#iconPerson').prop("class","");
        }
    }

    private getHorasPorCompensar(empleado: number) {
        this.showLoading = true;
        this.permisoService.obtenerHorasPorCompensarPorEmpleado(empleado).subscribe(
            horasPorCompensar => {
                this.empleadoCompensacion =horasPorCompensar;
                this.showLoading = false;
            },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            });
    }

    private getMotivosPermiso() {
        this.showLoading = true;
        this.permisoService.completarComboBox('obtenerMotivosPermiso').subscribe(
            tablaGeneralDto => {
                this.motivos = tablaGeneralDto;
                this.showLoading = false;
            },
            error =>  {
                this.showLoading = false;
                this.backendService.handleError(error);});
    }

    private obtenerHistoriaLaborales(idEmpleado: number) {
        this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
            historiaLaboral => {
                this.validateDataJefeInmediato(historiaLaboral)
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            });
    }

    validateDataJefeInmediato(historialLaboral: HistorialLaboral[]){
        if(historialLaboral.length!=0){
            this.historiasLaboralesActuales = historialLaboral;
            if(historialLaboral.length == 1){
                this.permisoEmpleado.idAtendidoPor = historialLaboral[0].idJefeInmediato;
                this.idJefeInmediatoDefault = historialLaboral[0].idJefeInmediato;
            }
        }else{
            this.jefeInmediatoCombo = false;
            this.messageValidation = "No se podra registrar la solicitud";
        }
    }

    private obtenerPeriodoEmpleadoActual(empleado: Empleado) {
        this.showLoading = true;
        this.permisoService.obtenerPeriodoEmpleadoActual(empleado).subscribe(
            periodoEmpleado => {
                this.periodoEmpleadoActual = periodoEmpleado;
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.handleError(error);
            });
    }

    selectJefeInmediatoPermiso(){
        $('#idAtendidoPor').css('border','none');
    }

    cargarTipoPermiso(value){
        $('#motivo').css('border','none');
        if(value == 'P'){
            this.isCompensarhoras=false;
            this.isPersonal=true;
            this.initiateGridPermisoPersonal();
        }else if(value == 'C'){
            this.isCompensarhoras=true;
            this.isPersonal=false;
            this.permisoEmpleado.fechaRecuperacion=undefined;
            this.permisoEmpleado.horaInicioRecuperacion=undefined;
            this.permisoEmpleado.horaFinRecuperacion=undefined;

            $('#datepickerHasta').removeClass('state-error');
            $('#datepickerHasta').parent().removeClass('state-error');

            $('#horaDesdeRecuperacion').removeClass('state-error');
            $('#horaDesdeRecuperacion').parent().removeClass('state-error');

            $('#horaHastaRecuperacion').removeClass('state-error');
            $('#horaHastaRecuperacion').parent().removeClass('state-error');
        } else {
            this.isCompensarhoras=false;
            this.isPersonal=false;
        }
    }

    onChangeHoraInicio(){
        $('#horaDesde').removeClass('state-error');
        $('#horaDesde').parent().removeClass('state-error');
    }

    onChangeHoraFin(value){
        debugger;
        if(this.permisoEmpleado.horaFin!=null){
            this.calcularTotalHoras();
        }
        $('#horaHasta').removeClass('state-error');
        $('#horaHasta').parent().removeClass('state-error');
    }

    onChangeFecha(value){
        this.permisoEmpleado.fecha = value;
        $('#datepickerDesde').removeClass('state-error');
        $('#datepickerDesde').parent().removeClass('state-error');
    }

    onChangeFechaRecuperacion(value){
        this.permisoEmpleado.fechaRecuperacion = value;
        $('#datepickerHasta').removeClass('state-error');
        $('#datepickerHasta').parent().removeClass('state-error');
    }

    searchDateParameter(){

        if (!this.isValidadCharacterDate)
            return;
        if(this.permisoEmpleado.fecha == null || this.permisoEmpleado.fecha === undefined){
            this.permisoEmpleado.fecha = this.inputDateInicioDatePicker;
        }
        if(this.permisoEmpleado.fechaRecuperacion == null || this.permisoEmpleado.fechaRecuperacion === undefined){
            this.permisoEmpleado.fechaRecuperacion = this.inputDateFinDatePicker;
        }
        $('#datepickerDesde').removeClass('state-error');
        $('#datepickerDesde').parent().removeClass('state-error');
        $('#datepickerHasta').removeClass('state-error');
        $('#datepickerHasta').parent().removeClass('state-error');


    }

    onChangeHoraInicioRecuperacion(){
        $('#horaDesdeRecuperacion').removeClass('state-error');
        $('#horaDesdeRecuperacion').parent().removeClass('state-error');
    }

    onChangeHoraFinRecuperacion(){
        $('#horaHastaRecuperacion').removeClass('state-error');
        $('#horaHastaRecuperacion').parent().removeClass('state-error');
    }

    validateValuesRequired(){
        let fechaActTemp:Date = new Date();

        let fechaAct:Date = new Date(fechaActTemp.getFullYear(),fechaActTemp.getMonth(),fechaActTemp.getDate());

        this.periodoEmpleadoActual.idEmpleado = this.empleado.idEmpleado;
        this.permisoEmpleado.periodoEmpleado = this.periodoEmpleadoActual;
        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        let cadena:string[] = this.permisoEmpleado.fecha.split('/');
        let horaIni:string[] = this.permisoEmpleado.horaInicio.split(':');
        let horaFin:string[] = this.permisoEmpleado.horaFin.split(':');

        let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

        let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

        let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));

        if(fechaFin.getTime()<fechaIni.getTime()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La hora final del permiso debe ser mayor a la hora inicial del permiso.'});
            return;
        }

        let interval= fechaFin.getTime()- fechaIni.getTime();
        let hours:number = interval / (1000*60*60);
        this.permisoEmpleado.horas = parseFloat(hours.toFixed(2));

        if( this.permisoEmpleado.motivo == 'P'){

            if(this.validarRequeridoFechaRecuperacion()){
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios de la Fecha de Recuperacion.'});
                return;
            }

            let cadenaRecuperacion:string[] = this.permisoEmpleado.fechaRecuperacion.split('/');
            let horaIniRecuperacion:string[] = this.permisoEmpleado.horaInicioRecuperacion.split(':');
            let horaFinRecuperacion:string[] = this.permisoEmpleado.horaFinRecuperacion.split(':');

            let fechaIniRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaIniRecuperacion[0]),parseInt(horaIniRecuperacion[1]));

            let fechaFinRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaFinRecuperacion[0]),parseInt(horaFinRecuperacion[1]));

            let fechaRec:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]));

            if(fechaFinRecuperacion.getTime()<fechaIniRecuperacion.getTime()){
                this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La hora final de recuperacion debe ser mayor a la hora inicial de recuperacion.'});
                return;
            }

        }
        this.confirmActive= true;
    }

    onRegistrarPermisoEmpleado(){
        this.confirmActive=false;
        this.showLoading  = true;
        this.permisoService.registrarPermisoEmpleado(this.permisoEmpleado).subscribe(
            (data:NotificacionResult) => {
                this.backendService.notification(this.msgs, data);
                if (data.codigo == 1) {
                    $('#btnGuardar').prop("disabled",true);
                    setTimeout(() => {
                        this._router.navigate(['/autogestion/consultarPermiso']);
                    }, 1500);
                }
                this.showLoading  = false;
            },
            error => {
                this.showLoading  = false;
                this.backendService.notification(this.msgs, error);
            }
        );

    }

    hide() {
        this.msgs = [];
    }

    cerrarDialog(){
        this.mensaje = '';
        $( '#dialog-message' ).dialog( "close" );
    }

    validarRequerido():boolean{

        let validacion = false;

        if(this.permisoEmpleado.idAtendidoPor === undefined || this.permisoEmpleado.idAtendidoPor == null){
            $('#idAtendidoPor').addClass('invalid').removeClass('required');
            $('#idAtendidoPor').parent().addClass('state-error').removeClass('state-success');
            $('#idAtendidoPor').css('border','2px solid red');
            validacion = true;
        }

        if(this.permisoEmpleado.motivo === undefined || this.permisoEmpleado.motivo == null || this.permisoEmpleado.motivo=='' ){
            $('#motivo').addClass('invalid').removeClass('required');
            $('#motivo').parent().addClass('state-error').removeClass('state-success');
            $('#motivo').css('border','2px solid red');
            validacion = true;
        }
        if(this.permisoEmpleado.fecha === undefined || this.permisoEmpleado.fecha == null || this.permisoEmpleado.fecha==''){
            $('#datepickerDesde').addClass('invalid').removeClass('required');
            $('#datepickerDesde').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if( this.permisoEmpleado.horaInicio === undefined || this.permisoEmpleado.horaInicio == null || this.permisoEmpleado.horaInicio==''){
            $('#horaDesde').addClass('invalid').removeClass('required');
            $('#horaDesde').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisoEmpleado.horaFin === undefined || this.permisoEmpleado.horaFin == null || this.permisoEmpleado.horaFin==''){
            $('#horaHasta').addClass('invalid').removeClass('required');
            $('#horaHasta').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    validarRequeridoFechaRecuperacion():boolean{

        let validacion = false;
        if(this.permisoEmpleado.fechaRecuperacion === undefined || this.permisoEmpleado.fechaRecuperacion == null || this.permisoEmpleado.fechaRecuperacion==''){
            $('#datepickerHasta').addClass('invalid').removeClass('required');
            $('#datepickerHasta').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisoEmpleado.horaInicioRecuperacion === undefined || this.permisoEmpleado.horaInicioRecuperacion == null || this.permisoEmpleado.horaInicioRecuperacion==''){
            $('#horaDesdeRecuperacion').addClass('invalid').removeClass('required');
            $('#horaDesdeRecuperacion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.permisoEmpleado.horaFinRecuperacion === undefined || this.permisoEmpleado.horaFinRecuperacion == null || this.permisoEmpleado.horaFinRecuperacion==''){
            $('#horaHastaRecuperacion').addClass('invalid').removeClass('required');
            $('#horaHastaRecuperacion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }
    public onClosePermiso() {
        this.closeForm();
    }
    public onCancelPermiso(e) {
        e.preventDefault();
        this.closeForm();
    }
    public closeForm(){
        this.confirmActive= false;
    }
    public showMessagePermiso(){
        this.validateValuesRequired();

    }
    public limpiarDatosPermiso(){
        this.permisoEmpleado.idAtendidoPor=this.idJefeInmediatoDefault;
        this.permisoEmpleado.motivo=null;
        this.permisoEmpleado.razon=null;
        this.permisoEmpleado.fecha=null;
        this.permisoEmpleado.horaInicio="";
        this.permisoEmpleado.horaFin="";
        this.permisoEmpleado.fechaRecuperacion=null;
        this.permisoEmpleado.horaInicioRecuperacion="";
        this.permisoEmpleado.horaFinRecuperacion="";
        this.isPersonal = false;
        $('#btnGuardar').prop("disabled",false);

    }
    public verSolicitudesPermiso() {
        localStorage.setItem('tabActive','tab1');
        this._router.navigate(['/autogestion/actualizarDatosPersonales']);
    }

    onRegresarConsultarPermiso(){
        this._router.navigate(['/autogestion/consultarPermiso']);
    }

    cambiarTodoDia(value){
        let isChecked:boolean = value.target.checked;
        this.permisoEmpleado.diaEntero = isChecked;
        if(this.permisoEmpleado.diaEntero == true){
            this.permisoEmpleado.idEmpleado = this.currentUser.idEmpleado;
            this.permisoService.obtenerHorarioEmpleadoDia(this.permisoEmpleado).subscribe(
                data => {
                    this.calcularTotalHorasTodoElDia(data.entrada, data.salida);
                    this.permisoEmpleado.horaInicio = data.entrada;
                    this.permisoEmpleado.horaFin = data.salida;
                    this.showLoading = false;
                },
                error => {
                    this.showLoading = false;
                    this.backendService.notification(this.msgs, error);
                }
            );
        }else{
            this.permisoEmpleado.horas = null;
            this.permisoEmpleado.horaInicio = null;
            this.permisoEmpleado.horaFin = null;
        }

    }
    calcularTotalHorasTodoElDia(entrada,salida){
        let cadena:string[] = moment().format('DD/MM/YYYY').split('/');
        let horaIni:string[] = entrada.split(':');
        let horaFin:string[] = salida.split(':');

        let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

        let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

        let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));

        let interval= fechaFin.getTime()- fechaIni.getTime();
        let hours:number = interval / (1000*60*60);
        this.permisoEmpleado.horas = parseFloat(hours.toFixed(2));
    }

    calcularTotalHoras(){
        let cadena:string[] = moment().format('DD/MM/YYYY').split('/');
        let horaIni:string[] = this.permisoEmpleado.horaInicio.split(':');
        let horaFin:string[] = this.permisoEmpleado.horaFin.split(':');

        let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

        let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

        let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));

        if(fechaFin.getTime()<fechaIni.getTime()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La hora final del permiso debe ser mayor a la hora inicial del permiso.'});
            return;
        }

        let interval= fechaFin.getTime()- fechaIni.getTime();
        let hours:number = interval / (1000*60*60);
        this.permisoEmpleado.horas = parseFloat(hours.toFixed(2));
    }

    initiateGridPermisoPersonal(){
    //this.permisosPersonales = [new PermisoEmpleadoRecuperacion('30/05/2017','08:00','18:00')];
        this.gridViewPermisoPersonal = {
            data: this.permisosPersonales.slice(this.skipPermisoPersonal, this.skipPermisoPersonal + this.pageSizePermisoPersonal),
            total: this.permisosPersonales.length
        };
    }

    addNew(){
        //this.permisosPersonales.push(new PermisoEmpleadoRecuperacion('30/05/2017','08:00','18:00'));
    }
    onEliminarPermisoPersonal(){

    }
    //Permiso Personal
    private editedRowIndex: number;
    formGroup: FormGroup;
    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }
    protected editHandler({sender, rowIndex, dataItem}) {

        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'idAutorizacion': new FormControl(dataItem.idAutorizacion),
            'autorizado': new FormControl(dataItem.autorizado)
        });

        this.editedRowIndex = rowIndex;

        sender.editRow(rowIndex, this.formGroup);
    }
    protected saveHandler({sender, rowIndex, formGroup, isNew}) {

        sender.closeRow(rowIndex);
    }
}
