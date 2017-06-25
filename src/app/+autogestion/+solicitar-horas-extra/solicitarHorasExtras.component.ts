import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {PermisoService} from "../../+common/service/permiso.service";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {Empleado} from "../../+dto/maintenance/empleado";
import {Message} from "primeng/components/common/api";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import * as moment from "moment";
import {ComponentBase} from "../../+common/service/componentBase";
import {BackendService} from "../../+rest/backend.service";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoCabecera} from "../../+dto/maintenance/empleadoCabecera";

declare var $: any;

@Component({
	selector: 'solicitarHorasExtra',
	templateUrl: 'solicitarHorasExtras.component.html',
	providers: [
		HorasExtraService]
})

export class SolicitarHorasExtraComponent extends ComponentBase implements OnInit {

	private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
	private horasExtra: HorasExtra = new HorasExtra();
	private empleado:Empleado = new Empleado();
	private historiasLaboralesActuales: HistorialLaboral[] = [];
	private defaultItemHistoriaLaboral: HistorialLaboral = new HistorialLaboral();
	private idJefeInmediatoDefault:number;
	private fechaDefault:string;
	private isHETrabajo:boolean=false;
	private isHEPersonal:boolean=false;

	msgsNot: Message[] = [];
	public tipoHorasExtra: TablaGeneralResult[];

	public defaultItemTablaGeneral: TablaGeneralResult = {codigo: null, nombre: 'Seleccione', grupo:null};
	public defaultItemTipoHoraExtra: TablaGeneralResult = {codigo: null, nombre: 'Seleccionar', grupo:null};

	private fotoEmpleado:string = '';
	private nombreCompletoEmpleado:string = '';

	private confirmActive=false;
	constructor(public backendService: BackendService,
				private permisoService:PermisoService,
				private horasExtraService: HorasExtraService,
				private _router: Router,
				private empleadoService: EmpleadoService,
				private location: Location) {
		super(backendService,'AU004');
	}

	ngOnInit() {
		this.showLoading = true;
		this.defaultItemHistoriaLaboral.idJefeInmediato = null;
		this.defaultItemHistoriaLaboral.jefeInmediato = 'Seleccionar';
		this.empleado.idEmpleado = this.currentUser.idEmpleado;
		let idEmpleado = this.currentUser.idEmpleado;
		let nowFormat = moment().format('DD/MM/YYYY');
		this.horasExtra.fecha = nowFormat;
		this.fechaDefault = this.horasExtra.fecha;

		this.obtenerEmpleado(idEmpleado);

		//calcular is personal de confianza
		this.obtenerEmpleadoEsPersonalConfianza(idEmpleado);
		this.obtenerHistoriaLaborales(idEmpleado);
		this.horasExtra.idEmpleado = this.currentUser.idEmpleado;
		this.obtenerHorasSemanalesPendientes(idEmpleado);
		this.getTipoHoraExtra();
		this.horasExtra.acuerdoTexto="La empresa y el trabajador acuerdan que las horas incurridas por motivos personales, no ser\u00e1n compensadas. Por favor registre su hora de salida";
		this.horasExtra.estoyDeAcuerdo=false;
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

	estoyDeAcuerdo(value){
		let isChecked:boolean = value.target.checked;
		this.horasExtra.estoyDeAcuerdo = isChecked;
	}

	obtenerHorasSemanalesPendientes(idEmpleado){
		this.showLoading = true;
		this.horasExtraService.obtenerHorasSemanalesPendientes(idEmpleado).subscribe(
			horasExtraAd => {
				this.cargarInformacionAdicional(horasExtraAd);
				this.showLoading = false;
				},
			error =>  {
				this.showLoading = false;
				this.backendService.handleError(error);
			});
	}

	obtenerEmpleadoEsPersonalConfianza(idEmpleado){
		this.showLoading = true;
		this.empleadoService.obtenerEmpleadoEsPersonalConfianza(idEmpleado).subscribe(
			(data:Empleado) => {
				this.cargarHorasExtras(data.esPersonalDeConfianza);
				this.showLoading = false;
			},
			error =>  {
				this.showLoading = false;
				this.backendService.handleError(error);
			});
	}

	cargarHorasExtras(esPersonalDeConfianza:boolean){

		if(esPersonalDeConfianza){
			this.msgsNot.push({severity:'warn', summary:'Advertencia', detail:'Como es personal de confianza, no puede solicitar horas extras.'});
			$('#btnGuardar').prop("disabled",true);
			$('#btnNueva').prop("disabled",true);
		}else {
			$('#btnGuardar').prop("disabled",false);
			$('#btnNueva').prop("disabled",false);
		}
	}

	cargarInformacionAdicional(data: HorasExtra){
		this.horasExtra.horaSalidaHorario = data.horaSalidaHorario;
		this.horasExtra.horasNoCompensables = data.horasSemanalesPendientes;
	}

	calcularHoraSalidaSolicitado(){

		if(this.horasExtra.horasAdicionales != null && this.horasExtra.horasAdicionales != undefined) {

			let horaIni: string[] = this.horasExtra.horaSalidaHorario.split(':');

			let fechaFin: Date = new Date(2017, 0, 1, parseInt(horaIni[0]), parseInt(horaIni[1]));

			fechaFin.setMinutes(fechaFin.getMinutes() + this.horasExtra.horasAdicionales * 60);

			let horaFin: string = this.autocompleteOneZeroLeft(fechaFin.getHours()) + ':' + this.autocompleteOneZeroLeft(fechaFin.getMinutes());

			this.horasExtra.horaSalidaSolicitado = horaFin;

			let horaTotalExtra = this.horasExtra.horasAdicionales - this.horasExtra.horasNoCompensables;

			if(horaTotalExtra <= 0){
				horaTotalExtra = 0;
			}

			this.horasExtra.horas = parseFloat(horaTotalExtra.toFixed(2));

		}
	}

	autocompleteOneZeroLeft(value:number):string{
		let val:string = value.toString();

		if(val.length == 1){
			val = '0' + val;
		}
		return val;
	}

	onRegistrarHorasExtraEmpleado(){
		this.confirmActive=false;
		this.showLoading  = true;
		this.empleadoService.registrarHorasExtra(this.horasExtra).subscribe(
			(data:NotificacionResult) => {
				this.backendService.notification(this.msgs, data);
				if (data.codigo == 1) {
					$('#btnGuardar').prop("disabled",true);
					setTimeout(() => {
						this._router.navigate(['/autogestion/consultarHorasExtra']);
					}, 1500);
				}
				this.showLoading  = false;
			}, error => {
				this.showLoading  = false;
				this.backendService.notification(this.msgs, error);
			}

		);
	}

	/* VALIDACIONES */
	validarRequerido():boolean{
		let validacion = false;

		if(this.horasExtra.tipo=== undefined || this.horasExtra.tipo == null || this.horasExtra.tipo=='' ){
			$('#tipoHoraExtra').addClass('invalid').removeClass('required');
			$('#tipoHoraExtra').parent().addClass('state-error').removeClass('state-success');
			$('#tipoHoraExtra').addClass('input-error');
			validacion = true;
		} else {
			$('#tipoHoraExtra').removeClass('input-error');
		}
		if(this.horasExtra.idAtendidoPor === undefined || this.horasExtra.idAtendidoPor == null  ){
			$('#idAtendidoPor').addClass('invalid').removeClass('required');
			$('#idAtendidoPor').parent().addClass('state-error').removeClass('state-success');
			$('#idAtendidoPor').addClass('input-error');
			validacion = true;
		} else {
			$('#idAtendidoPor').removeClass('input-error');
		}
		if(this.horasExtra.fecha === undefined || this.horasExtra.fecha == null || this.horasExtra.fecha=='' ){
			$('#fecha').addClass('invalid').removeClass('required');
			$('#fecha').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}
		if(this.horasExtra.horas === undefined || this.horasExtra.horaSalidaSolicitado == null || this.horasExtra.horasAdicionales == null){
			$('#horas').addClass('invalid').removeClass('required');
			$('#horas').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}
		if(this.horasExtra.motivo === undefined || this.horasExtra.motivo == null || this.horasExtra.motivo=='' ){
			$('#motivo').addClass('invalid').removeClass('required');
			$('#motivo').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}

		return validacion;
	}

	validarDeAcuerdo():boolean{
		let validacion = false;
		if((this.horasExtra.estoyDeAcuerdo === undefined || this.horasExtra.estoyDeAcuerdo == null || this.horasExtra.estoyDeAcuerdo==false)
			&& (this.horasExtra.tipo=='P' || this.horasExtra.tipo=='T')){
			validacion = true;
		}
		return validacion;
	}

	validarRequeridoHoraSalida():boolean{
		let validacion = false;
		if(this.horasExtra.fecha === undefined || this.horasExtra.fecha == null || this.horasExtra.fecha=='' ){
			$('#fecha').addClass('invalid').removeClass('required');
			$('#fecha').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}
		return validacion;
	}

	/* DETECTED CHANGE */
	onChangeFecha(value){
		this.horasExtra.fecha = value;

	}
	onChangeMotivo(val){
		this.horasExtra.motivo = val;
	}
	onChangeHoraSalidaSolicitado(val){

		if(this.validarRequeridoHoraSalida()){
			this.mensaje = 'Ingrese la fecha';
			this.horasExtra.horaSalidaSolicitado = null;
			return;
		}
		this.horasExtra.horaSalidaSolicitado = val;

		$('#horaSalidaSolicitado').removeClass('state-error');
		$('#horaSalidaSolicitado').parent().removeClass('state-error');


		this.empleado.fechaIngreso = this.horasExtra.fecha;
		this.obtenerInformacionAdicional(this.empleado);

		this.horasExtra.horasSemanalesPendientes = 0;

	}

	/* SERVICIOS REST */

	private obtenerHistoriaLaborales(idEmpleado: number) {
		this.showLoading = true;
		this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
			historiaLaboral => {
				this.validateDataJefeInmediato(historiaLaboral);
				this.showLoading = false;
				},
			error =>  {
				this.showLoading = false;
				this.backendService.handleError(error);
			});
	}

	validateDataJefeInmediato(historialLaboral: HistorialLaboral[]){
		if(historialLaboral.length!=0){
			this.historiasLaboralesActuales = historialLaboral;
			if(historialLaboral.length == 1){
				this.horasExtra.idAtendidoPor = historialLaboral[0].idJefeInmediato;
				this.idJefeInmediatoDefault = historialLaboral[0].idJefeInmediato;
			}
		}else{
			this.historiasLaboralesActuales = historialLaboral;
		}
	}

	private obtenerHistoriaLaboralActual(empleado: Empleado) {
		this.showLoading = true;
		this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
			historiaLaboral => {
				this.historiaLaboralActual = historiaLaboral;
				this.showLoading = false;
				},
			error =>  {
				this.showLoading = false;
				this.backendService.handleError(error);
			});
	}

	private obtenerInformacionAdicional(empleado: Empleado){
		this.showLoading = true;
		this.permisoService.obtenerInformacionAdicional(this.empleado).subscribe(
			infoAdicional => {
				this.getTotalHorasExtras(infoAdicional);
				this.showLoading = false;
			},
			error =>  {
				this.showLoading = false;
				this.backendService.handleError(error);
			});
	}

	getTotalHorasExtras(infoAdicionalVal:HorasExtra){
		this.horasExtra.horaSalidaHorario = infoAdicionalVal.horaSalidaHorario;
		var start = moment.utc(this.horasExtra.horaSalidaHorario, "HH:mm");
		var end = moment.utc(this.horasExtra.horaSalidaSolicitado, "HH:mm");
		// account for crossing over to midnight the next day
		if (end.isBefore(start)) end.add(1, 'day');

		// calculate the duration
		var d = moment.duration(end.diff(start));

		// subtract the lunch break
		d.subtract(30, 'minutes');

		var s = moment.utc(+d).format('H.mm');

	}


	goBack(): void {
		this.location.back();
	}

	public onClose() {
		this.closeForm();
	}
	public onCancel(e) {
		e.preventDefault();
		this.closeForm();
	}
	public closeForm(){
		this.confirmActive= false;
		//this.cancel.emit();
	}
	public showMessage(){
		this.validateValuesRequired();
	}

	private validateValuesRequired(){
		if(this.validarRequerido()){
			this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
			return;
		}
		if(this.validarDeAcuerdo()){
			this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Indique si esta de acuerdo con el texto mostrado al solicitar horas extras .'});
			return;
		}

		this.confirmActive= true;
	}

	ingresaHoras(){
		$('#horas').parent().removeClass('state-error');
	}

	ingresaMotivo(){
		$('#motivo').parent().removeClass('state-error');
	}

	public limpiarDatos(){
		this.horasExtra.idAtendidoPor=this.idJefeInmediatoDefault;
		this.horasExtra.fecha=this.fechaDefault;

		this.horasExtra.horaSalidaSolicitado=null;
		this.horasExtra.motivo=null;

		this.horasExtra.horas = null;
		this.horasExtra.horasAdicionales=null;
		this.horasExtra.estoyDeAcuerdo=false;
		this.horasExtra.tipo=null;
		$('#btnGuardar').prop("disabled",false);
		this.isHEPersonal=false;
		this.isHETrabajo=false;
	}
	public verSolicitudesHE() {
		localStorage.setItem('tabActive','tab3');
		this._router.navigate(['/autogestion/actualizarDatosPersonales']);
	}

	public getTipoHoraExtra(){
		this.tipoHorasExtra = this.storageCommomnValueResult.tablaGeneral.
		filter(grupo => 'HorasExtra.Tipo' === grupo.grupo && 'C'!=grupo.codigo);
	}

	public selectJefeInmediatoHoraExtra(value){
		$('#idAtendidoPor').css('border','none');
	}
	public cargarTipoHoraExtra(value){

		$('#tipoHoraExtra').css('border','none');
		if(value == 'P'){
			this.isHETrabajo=false;
			this.isHEPersonal=true;
			this.horasExtra.acuerdoTexto="La empresa y el trabajador acuerdan que las horas incurridas por motivos personales, " +
				"no ser\u00E1n compensadas. Por favor registre su hora de salida.";
		} else if (value == 'T'){
			this.isHETrabajo=true;
			this.isHEPersonal=false;
			this.horasExtra.acuerdoTexto="La empresa y el trabajador acuerdan que las horas laboradas en sobre tiempo antes mencionadas ser\u00E1n" +
				" compensadas mediante el otorgamiento de periodos equivalentes de descanso a ser tomados," +
				" en la oportunidad que ambas partes determinen de com\u00FAn acuerdo, pudiendo efectuarse la compensaci\u00F3n durante el a\u00F1o calendario" +
				" en que se realizaron a\u00FAn luego de transcurridos 30 d\u00EDas"+
				" desde la realizaci\u00F3n de la labor en sobretiempo, de conformidad con el art. 26 del DS 008-2002-TR. El tiempo que exceda las 48 horas" +
				" semanales de ley, ser\u00E1 compensado con periodos equivalentes de descanso.";
		} else {
			this.isHETrabajo=false;
			this.isHEPersonal=false;
		}
	}

	onRegresarConsultarHorasExtra(){
		this._router.navigate(['/autogestion/consultarHorasExtra']);
	}
}