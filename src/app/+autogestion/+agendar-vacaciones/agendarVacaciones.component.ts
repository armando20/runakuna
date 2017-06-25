import { Component, OnInit } from '@angular/core';
import {PermisoService} from "../../+common/service/permiso.service";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Empleado} from "../../+dto/maintenance/empleado";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {ComponentBase} from "../../+common/service/componentBase";
import {Router} from "@angular/router";
import {BackendService} from "../../+rest/backend.service";

import {NotificacionResult} from "../../+dto/notificacionResult";

import {ExpressionRegularValidate} from "../../+common/Utils/expressionRegularValidate";
import {EmpleadoCabecera} from "../../+dto/maintenance/empleadoCabecera";
import {PeriodoEmpleadoResult} from "../../+dto/PeriodoEmpleadoResult";
import {PeriodoEmpleadoService} from "../../+common/service/periodoEmpleado.service";
import {VacacionService} from "../../+common/service/vacacion.service";

declare var $: any;

@Component({
	selector: 'agendarVacaciones',
	templateUrl: 'agendarVacaciones.component.html',
	providers : [VacacionService]
})

export class AgendarVacacionesComponent extends ComponentBase implements OnInit {
	private historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
	private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();
	private agendarVacacion: Vacacion = new Vacacion();
	private agendarVacacionPeriodo: Vacacion = new Vacacion();
	private empleado:Empleado = new Empleado();

	private historiasLaboralesActuales: HistorialLaboral[] = [];

	private confirmActive=false;

	private fotoEmpleado:string = '';
	private nombreCompletoEmpleado:string = '';

	private defaultItemHistoriaLaboral: HistorialLaboral = new HistorialLaboral();
	private idJefeInmediatoDefault:number;

	private periodos:PeriodoEmpleadoResult[] = [];

	private tituloPopup:String = '';

	constructor(public backendService: BackendService,
				private _router: Router,
				private vacacionService: VacacionService,
				private permisoService:PermisoService,
				private periodoService:PeriodoEmpleadoService,
				private empleadoService: EmpleadoService) {
		super(backendService,'AU003');
		this.defaultItemHistoriaLaboral.idJefeInmediato = null;
		this.defaultItemHistoriaLaboral.jefeInmediato = 'Seleccionar';
	}

	ngOnInit() {
		this.empleado.idEmpleado = this.currentUser.idEmpleado;
		let idEmpleado = this.currentUser.idEmpleado;
		this.obtenerEmpleado(idEmpleado);
		this.obtenerHistoriaLaborales(idEmpleado);
		this.obtenerPeriodoActual(this.empleado);
		this.obtenerDiasDisponibles(this.empleado);

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

	onRegistrarVacaciones(){

		this.confirmActive=false;
		this.showLoading  = true;
		this.agendarVacacion.idEmpleado = this.empleado.idEmpleado;
		this.agendarVacacion.idPeriodoEmpleado = this.agendarVacacionPeriodo.idPeriodoEmpleado;

		this.empleadoService.registrarVacaciones(this.agendarVacacion).subscribe(
			(data:NotificacionResult) => {
				this.backendService.notification(this.msgs, data);
				if (data.codigo == 1) {
					$('#btnGuardar').prop("disabled",true);
					setTimeout(() => {
						this._router.navigate(['/autogestion/consultarVacaciones']);
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

	validarRequerido():boolean{

		let validacion = false;
		if(this.agendarVacacion.fechaInicio === undefined || this.agendarVacacion.fechaInicio == null || this.agendarVacacion.fechaInicio=='' ){
			$('#datepickerDesde').addClass('invalid').removeClass('required');
			$('#datepickerDesde').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}
		if(this.agendarVacacion.fechaFin === undefined || this.agendarVacacion.fechaFin == null || this.agendarVacacion.fechaFin=='' ){
			$('#datepickerHasta').addClass('invalid').removeClass('required');
			$('#datepickerHasta').parent().addClass('state-error').removeClass('state-success');
			validacion = true;
		}
		if(this.agendarVacacion.idAtendidoPor=== undefined || this.agendarVacacion.idAtendidoPor == null ){
			$('#jefeInmediato').addClass('invalid').removeClass('required');
			$('#jefeInmediato').parent().addClass('state-error').removeClass('state-success');
			$('#jefeInmediato').css('border','2px solid red');
			validacion = true;
		}


		return validacion;
	}

	private obtenerHistoriaLaborales(idEmpleado: number) {
		this.showLoading = true;
		this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
			historiaLaboral => {
				this.validateDataJefeInmediato(historiaLaboral);
				this.showLoading = false;
			},
			error =>  {
				this.errorMessage = <any>error;
				this.showLoading = false;
			});
	}

	private busquedaPeriodoDisponibleVacaciones(idEmpleado: number) {
		this.showLoading = true;
		this.periodoService.busquedaPeriodoDisponibleVacaciones(idEmpleado).subscribe(
			periodos =>{
				this.agregarTotal(periodos);
				this.showLoading = false;
			},
			error =>  {
				this.errorMessage = <any>error;
				this.showLoading = false;
			});
	}

	agregarTotal(data:PeriodoEmpleadoResult[]){
		this.periodos = data;

		let periodoTotal:PeriodoEmpleadoResult = new PeriodoEmpleadoResult();

		periodoTotal.periodo = 'TOTAL';
		periodoTotal.diasVacacionesDisponibles = this.agendarVacacion.diasVacacionesAcumulado.toString();

		this.periodos.push(periodoTotal);
		this.showLoading = false;

	}

	validateDataJefeInmediato(historialLaboral: HistorialLaboral[]){
		if(historialLaboral.length!=0){
			this.historiasLaboralesActuales = historialLaboral;
			if(historialLaboral.length == 1){
				this.agendarVacacion.idAtendidoPor = historialLaboral[0].idJefeInmediato;
				this.idJefeInmediatoDefault = historialLaboral[0].idJefeInmediato;
			}
		}else{
			this.historiasLaboralesActuales = historialLaboral;
		}
		this.showLoading = false;
	}

	private obtenerDiasDisponibles(empleado: Empleado) {
		this.showLoading = true;
		this.permisoService.obtenerDiasDisponiblesDeVacacion(empleado).subscribe(
			(diasDisponibles:Vacacion) => {
				this.agendarVacacion.diasVacacionesDisponibles = diasDisponibles.diasVacacionesDisponibles;
				this.agendarVacacion.diasVacacionesAcumulado = diasDisponibles.diasVacacionesAcumulado;
				//this.busquedaPeriodoDisponibleVacaciones(this.empleado.idEmpleado);
				this.periodoService.busquedaPeriodoDisponibleVacaciones(this.empleado.idEmpleado).subscribe(
					periodos =>{
						this.agregarTotal(periodos);
						//this.showLoading = false;
					},
					error =>  {
						this.errorMessage = <any>error;
						this.showLoading = false;
					});
				//this.showLoading = false;
				},
			error =>  {
				this.showLoading = false;
				this.errorMessage = <any>error;
			});
	}

	private obtenerPeriodoActual(empleado: Empleado) {
		this.showLoading = true;
		this.permisoService.obtenerPeriodoActual(empleado).subscribe(
			periodoEmpleado => {
				this.agendarVacacionPeriodo = periodoEmpleado;
				this.showLoading = false;
				},
			error =>  {
				this.showLoading = false;
				this.errorMessage = <any>error;
			});
	}

	selectJefeInmediato(value){
		$('#jefeInmediato').css('border','none');
	}

	onChangeFechaInicio(value){
		if(value.type == 'change'){
			return;
		}
		this.agendarVacacion.fechaInicio = value;
		$('#datepickerDesde').removeClass('state-error');
		$('#datepickerDesde').parent().removeClass('state-error');
		if(this.agendarVacacion.fechaFin != null){
			this.onDiasCalendarios();
		}

	}
	onChangeFechaFin(value){
		if(value.type == 'change'){
			return;
		}
		this.agendarVacacion.fechaFin = value;
		$('#datepickerHasta').removeClass('state-error');
		$('#datepickerHasta').parent().removeClass('state-error');
		this.onDiasCalendarios();

	}

	searchDateParameter(){

		if (!this.isValidadCharacterDate)
			return;
		if(this.agendarVacacion.fechaInicio == null || this.agendarVacacion.fechaInicio === undefined){
			this.agendarVacacion.fechaInicio = this.inputDateInicioDatePicker;
		}if(this.agendarVacacion.fechaFin == null || this.agendarVacacion.fechaFin === undefined){
			this.agendarVacacion.fechaFin = this.inputDateFinDatePicker;
		}
		$('#datepickerDesde').removeClass('state-error');
		$('#datepickerDesde').parent().removeClass('state-error');
		if(this.agendarVacacion.fechaFin){
			this.onDiasCalendarios();
			this.isValidadCharacterDate = false;
			return;
		}
		$('#datepickerHasta').removeClass('state-error');
		$('#datepickerHasta').parent().removeClass('state-error');

		this.isValidadCharacterDate = false;
	}

	onDayMommentJS(){
		var result = 0;

		let cadenaFInicio:string[] = this.agendarVacacion.fechaInicio.split('/');
		let cadenaFFin:string[] = this.agendarVacacion.fechaFin.split('/');

		let fechaIni:Date= new Date( parseInt(cadenaFInicio[2]),parseInt(cadenaFInicio[1])-1,parseInt(cadenaFInicio[0]));

		let fechaFin:Date= new Date( parseInt(cadenaFFin[2]),parseInt(cadenaFFin[1])-1,parseInt(cadenaFFin[0]));

		fechaIni.setHours(0,0,0,1);  // Start just after midnight
		fechaFin.setHours(23,59,59,999);  // End just before midnight

		var currentDate = fechaIni;
		while (currentDate <= fechaFin)  {

			var weekDay = currentDate.getDay();
			if(weekDay != 0 && weekDay != 6)
				result++;

			currentDate.setDate(currentDate.getDate()+1);
		}
		return result;
	}


	onDiasCalendarios(){

		if(this.agendarVacacion.fechaInicio === undefined || this.agendarVacacion.fechaFin === undefined){
			return;
		}
		let cadenaFInicio:string[] = this.agendarVacacion.fechaInicio.split('/');
		let cadenaFFin:string[] = this.agendarVacacion.fechaFin.split('/');

		let fechaIni:Date= new Date( parseInt(cadenaFInicio[2]),parseInt(cadenaFInicio[1])-1,parseInt(cadenaFInicio[0]));

		let fechaFin:Date= new Date( parseInt(cadenaFFin[2]),parseInt(cadenaFFin[1])-1,parseInt(cadenaFFin[0]));

		let interval= fechaFin.getTime()- fechaIni.getTime();

		let diasCalendariosVal:number = interval / (1000 * 60 * 60 * 24);


		let millisecondsPerDay = 86400 * 1000; // Day in milliseconds
		fechaIni.setHours(0,0,0,1);  // Start just after midnight
		fechaFin.setHours(23,59,59,999);  // End just before midnight
		let diff = fechaFin.getTime() - fechaIni.getTime();  // Milliseconds between datetime objects
		let dias = Math.ceil(diff / millisecondsPerDay);

		this.agendarVacacion.diasCalendarios = dias;

		//Dias Habiles
		//Restar dos semanas por cada semana
		let weeks = Math.floor(dias / 7);

		//dias = dias - (weeks * 2);
		dias -= weeks * 2;

		//Manejar casos especiales
		let startDay = fechaIni.getDay();
		let endDay = fechaFin.getDay();
		//Eliminar el fin de semana no eliminado previamente
		if(startDay - endDay > 1)
		//dias = dias -2;
			dias -= 2;

		//Eliminar el dÃ­a de inicio si el perÃ­odo comienza el domingo
		//pero finaliza antes del sÃ¡bado
		if(startDay == 0 && endDay != 6)
			dias = dias -1;

		//Eliminar el dÃ­a final si el perÃ­odo termina el sÃ¡bado
		//pero empieza despuÃ©s del domingo
		if(endDay == 6 && startDay != 0)
		//dias = dias -1
			dias--;
		// Remove end day if span ends on Saturday but starts after Sunday
		/*if (endDay == 6 && startDay != 0) {
		 dias--;
		 }*/

		this.agendarVacacion.diasHabiles = dias;
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

		this.showLoading = true;

		this.vacacionService.obtenerDiasVacacionesPendientes(this.empleado.idEmpleado).subscribe(
			(diasPendientes:number) => {
				this.showLoading = false;
				let diasDiponibleTotal:number = this.agendarVacacion.diasVacacionesAcumulado + parseInt(this.agendarVacacion.diasVacacionesDisponibles);
				let diasDisponiblesPedir:number =  diasDiponibleTotal - diasPendientes;

				if(this.agendarVacacion.diasHabiles > diasDiponibleTotal){

					this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Los dias Habiles solicitados excede a los dias disponibles acumuladas.'});
					return
				 }

				if(this.agendarVacacion.diasHabiles > diasDisponiblesPedir ){
					this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Tiene vacaciones solicitadas sin atender.'});
					return;
				}

				if(parseInt(this.agendarVacacionPeriodo.diasVacacionesDisponibles) < this.agendarVacacion.diasHabiles){
					this.tituloPopup = 'Se registrara 2 o mas solicitudes de vacaciones con diferentes periodos. ¿Desea continuar?';
				}else{
					this.tituloPopup = 'La solicitud se enviara a su jefe. ¿Desea continuar?';
				}

				this.confirmActive= true;
			},
			error =>  {
				this.showLoading = false;
				this.confirmActive= false;
				this.errorMessage = <any>error;
			});



		//verificar vacaciones

		/*if(this.agendarVacacion.diasHabiles > parseInt(this.agendarVacacionPeriodo.diasVacacionesDisponibles)){

			this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Los dias Habiles solicitados excede a los dias disponibles del periodo vacacional '+this.agendarVacacionPeriodo.periodo+'.'});
			return;
		}*/


	}

	public limpiarDatos(){
		this.agendarVacacion.idAtendidoPor=this.idJefeInmediatoDefault;
		this.agendarVacacion.fechaInicio=undefined;
		this.agendarVacacion.diasCalendarios=null;
		this.agendarVacacion.fechaFin=undefined;
		this.agendarVacacion.diasHabiles=null;

		$('#btnGuardar').prop("disabled",false);

	}

	public verSolicitudesVacaciones() {

		localStorage.setItem('tabActive','tab2');
		this._router.navigate(['/autogestion/actualizarDatosPersonales']);
	}

	onRegresarConsultarVacaciones(){
		this._router.navigate(['/autogestion/consultarVacaciones']);
	}
	onModelChangeDateDesde(value,idControl){
		var lenghtInputDate = value.length;
		if (lenghtInputDate == 10) {
			if(this.validateOnModelChangeDateDesde(value,idControl)){
				this.onDiasCalendarios();
			}
		}
	}

	private validateOnModelChangeDateDesde(value,idControl): boolean{
		let validateFormat = value ===undefined ? true : ExpressionRegularValidate.isValidateDateInput(value);
		if(!validateFormat){
			this.msgs.push({severity:'error', summary:'Ingrese una Fecha v\u00e1lida', detail:'Runakuna Error'});
			$('#'+idControl).addClass('invalid').removeClass('required');
			$('#'+idControl).parent().addClass('state-error').removeClass('state-success');
			this.cleanGridView();
			return;
		}else{
			$('#'+idControl).removeClass('state-error');
			$('#'+idControl).parent().removeClass('state-error');
		}
		return true;
	}

}