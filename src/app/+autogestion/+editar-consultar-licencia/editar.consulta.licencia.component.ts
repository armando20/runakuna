import {Component, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoService} from "../../+common/service/permiso.service";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {Empleado} from "../../+dto/maintenance/empleado";
import {NotificacionResult} from "../../+dto/NotificacionResult";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Licencia} from "../../+dto/maintenance/licencia";
import {LicenciaFilter} from "../../+dto/licenciaFilter";
import {CompleterData, CompleterService} from "ng2-completer";
import {TipoLicencia} from "../../+dto/maintenance/tipoLicencia";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {Observable} from "rxjs";
import {AdministrarLicenciaDocumentComponent} from "./administrar.licencia.edit.form";
import {Router} from "@angular/router";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {LicenciaService} from "../../+common/service/licencia.service";
import {ComponentBase} from "../../+common/service/componentBase";
import {setTimeout} from "timers";
import {BackendService} from "../../+rest/backend.service";
import {MotivoLicenciaRechazoComponent} from "./motivoLicenciaRechazo";
import {PageChangeEvent} from "@progress/kendo-angular-grid";
import {EditarConsultaLicenciaAnexar} from "./editar.consulta.licencia.anexar";

declare var $: any;
var moment = require('moment');

@Component({
    selector: 'editar-consulta-licencia',
    templateUrl: 'editar.consulta.licencia.component.html'
})
export class EditarConsultaLicenciaComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar',grupo:null};
    public licencia:Licencia= new Licencia();
    private periodoEmpleadoActual: PeriodoEmpleado = new PeriodoEmpleado();
    public empleado:Empleado = new Empleado();
    public historiaLaboralActual: HistorialLaboral = new HistorialLaboral();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    busquedaLicencias: LicenciaFilter = new LicenciaFilter();
    public tipoLicencia: TipoLicencia[];
    private historiasLaboralesActuales: HistorialLaboral[] = [];
    public isCheckedTodoDia:boolean=true;
    public showButtonValidarAuthorized:boolean=false;
    public showButtonDenegarAuthorized:boolean=false;
    private defaultItemHistoriaLaboral: any = {idJefeInmendiato:null, jefeInmediato:'Seleccionar'};
    private dataServiceEmpleado:CompleterData;
    private view: Array<DocumentoEmpleado>=[];
    private pageSize: number = 10;
    private skip: number = 0;
    public dataItem: DocumentoEmpleado;

    public isRhana:boolean= false;
    private confirmActive=false;

    constructor(private empleadoService: EmpleadoService,
                private licenciaService: LicenciaService,
                public backendService: BackendService,
                private permisoService:PermisoService,
                private completerService: CompleterService,
                private location: Location) {
        super(backendService,'GT003');

    }

    ngOnInit() {
        this.showLoading = true;
        this.dataServiceEmpleado = this.completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');
        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editarConsultaLicencia');
        if(!this.storeSessionFilter.isNew){
            this.obtenerLicenciaById(this.storeSessionFilter.idTableFilter);
        }else{
            this.licencia = new Licencia();
            this.licencia.diaEntero = true;
            this.isCheckedTodoDia = true;
        }
        this.getTipoLicencias();
    }

    esRhana() {
        var index;
        for(index=0;index<this.currentUser.assignedRoles.length;index++) {
            var r=this.currentUser.assignedRoles[index]
            if(r.roleDefault && r.roleName=='RHANA'){
                this.isRhana=true;
            }
        }
    }

    cambiarTodoDia(value){
        let isChecked:boolean = value.target.checked;
        this.isCheckedTodoDia = isChecked;
    }

    private obtenerLicenciaById(idLicencia: any): void{
        this.showLoading = true;
        this.licenciaService.obtenerLicenciaById(idLicencia).subscribe(
            data => {
                this.showDetail(data);
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }
    showDetail(data:Licencia){

        this.isCheckedTodoDia = data.diaEntero;
        this.licencia = data;
        this.empleado.idEmpleado = this.licencia.idEmpleado;
        this.view = this.licencia.documentos;
        this.obtenerHistoriaLaborales(this.empleado.idEmpleado);
        this.obtenerHistoriaLaboralActual(this.empleado);
        this.obtenerPeriodoEmpleadoActual(this.empleado);
        if(this.isAuthorized('Validar') && this.licencia.estado=='A'){
            this.showButtonValidarAuthorized = true;
        }
        if(this.isAuthorized('Rechazar') && ((this.licencia.estado=='A') || (this.licencia.estado=='E' && this.licencia.idAtendidoPor == this.currentUser.idEmpleado))){
            this.showButtonDenegarAuthorized = true;
        }
    }

    private obtenerHistoriaLaborales(idEmpleado: number) {
        this.showLoading = true;
        this.permisoService.obtenerHistoriasLaboralesPorEmpleado(idEmpleado).subscribe(
            historiaLaboral => {
                this.historiasLaboralesActuales = historiaLaboral;
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            });
    }

    public eliminarDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        return this.fetch("destroy", data);
    }

    public onDelete(e: DocumentoEmpleado): void {
        const operation = this.eliminarDocumento(e);
    }

    private fetch(action: string = "", data?: DocumentoEmpleado): Observable<DocumentoEmpleado[]>  {
        if(action=="create"){
            var documento : DocumentoEmpleado = (JSON.parse(JSON.stringify(data)));
            this.view.push(documento);
        }else if(action=="update"){
            var indice = this.view.indexOf(data);
            if(indice>=0)
                this.view[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.view.indexOf(data);
            if(indice>=0)
                this.view.splice(indice, 1);
        }

        return Observable.of(this.view);
    }
    public onViewDocument(dto: DocumentoEmpleado): void {

        if ($("#export_file").length > 0) {
            $("#export_file").remove();
        }
        if ($("#export_file").length === 0) {
            var iframe = $("<iframe src='' name='export_file' id='export_file'></iframe>");
            iframe.appendTo("body");
            var form = $("<form action='"+this.urlDowloadFile+"' method='post' target='_blank'></form>");
            form.append($("<input type='hidden' name='contenidoArchivo' id='contenidoArchivo' />").attr("value",dto.contenidoArchivo));
            form.append($("<input type='hidden' name='tipoArchivo' id='tipoArchivo' />").attr("value",dto.tipoArchivo));
            form.append($("<input type='hidden' name='nombre' id='nombre' />").attr("value",dto.nombre));
            form.append($("<input type='hidden' name='nombreArchivo' id='nombreArchivo' />").attr("value",dto.nombreArchivo));
            form.appendTo("body");
            form.submit();
        }

    }

    public onSave(dto: DocumentoEmpleado): void {

        const operation = dto.idDocumentoEmpleado === undefined ?
            this.crearDocumento(dto) :
            this.editarDocumento(dto);
    }

    public onCancel(): void {
        this.dataItem = undefined;
    }

    generarIdDocumentoTemporal():number {
        if (this.view != null)
            return (this.view.length + 2)* -1;
        else
            return-1;
    }

    public crearDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        data.idDocumentoEmpleado = this.generarIdDocumentoTemporal();
        return this.fetch("create", data);

    }
    public editarDocumento(data: DocumentoEmpleado): Observable<DocumentoEmpleado[]> {
        return this.fetch("update", data);
    }

    cargarTipoLicencia(value){
        $('#idTipoLicenciaReq2').css('border','none');
        this.licencia.idTipoLicencia = value;
    }

    selectJefeInmediato(value){
        $('#idJefeInmediatoReq1').css('border','none');
        $('#idJefeInmediatoReq2').css('border','none');
    }
    changeComentario(){
        $('#comentarioReq2').parent().removeClass('state-error');
    }

    private getTipoLicencias(){
        this.tipoLicencia = this.storageCommomnValueResult.tipoLicencia;
    }

    selectEmpleado(e){
        if(e !=null) {
            this.busquedaLicencias.idEmpleado = e.originalObject.idEmpleado;
            this.obtenerHistoriaLaboralLicencia(this.busquedaLicencias);
            this.empleado.idEmpleado = this.busquedaLicencias.idEmpleado;
            this.obtenerPeriodoEmpleadoActual(this.empleado);
            this.obtenerHistoriaLaborales(this.empleado.idEmpleado);
        }else{
            this.busquedaLicencias.idEmpleado = null;
        }
    }

    onChangeFechaInicio(value){
        this.licencia.fechaInicio = value;
        if(this.licencia.fechaFin){
            this.validateDaysBetweenTwoDays(this.licencia.fechaFin,this.licencia.fechaInicio);
        }
    }
    onChangeFechaFin(value){
        this.licencia.fechaFin = value;
        if(this.licencia.fechaInicio){
            this.validateDaysBetweenTwoDays(this.licencia.fechaFin,this.licencia.fechaInicio);
        }
    }

    private validateDaysBetweenTwoDays(dateFin, dateIni){
        var var1 = dateIni.split('/');
        var varYearIni = var1[2];
        var varMonthIni = var1[1];
        var varDayIni = var1[0];
        var var2    = dateFin.split('/');
        var varYearFin = var2[2];
        var varMonthFin = var2[1];
        var varDayFin = var2[0];
        var FinDiff = moment([varYearFin, varMonthFin-1, varDayFin]);
        var IniDiff = moment([varYearIni, varMonthIni-1, varDayIni]);

        if(FinDiff>=IniDiff){
            let resultDiff = Math.abs(FinDiff.diff(IniDiff, 'days'))+1;
            this.licencia.dias = resultDiff;
            $('#fechaInicioReq2').removeClass('state-error');
            $('#fechaInicioReq2').parent().removeClass('state-error');
            $('#fechaFinReq2').removeClass('state-error');
            $('#fechaFinReq2').parent().removeClass('state-error');
        }else{
            this.msgs.push({severity:'error', summary:'Ingrese una fecha menor a la Fecha Fin', detail:'Runakuna Error'});
            $('#fechaInicioReq2').addClass('invalid').removeClass('required');
            $('#fechaInicioReq2').parent().addClass('state-error').removeClass('state-success');
        }
    }
    private validarFechas():boolean {
        let validacion = false;
        if (this.licencia.fechaFin!=null && this.licencia.fechaFin!='') {

            var parts = this.licencia.fechaInicio.split("/");
            var desde = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            parts = this.licencia.fechaFin.split("/");
            var hasta = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));

            if (hasta < desde) {
                $('#fechaInicioReq2').parent().addClass('state-error').removeClass('state-success');
                $('#fechaFinReq2').parent().addClass('state-error').removeClass('state-success');
                validacion = true;
            }
        }
        return validacion;
    }

    private onRegistrarLicenciaEmpleado(){
        if(this.licencia.nombreEmpleado === undefined || this.licencia.nombreEmpleado == null || this.licencia.nombreEmpleado==''){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese el nombre del Empleado.'});
            return;
        }

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        if (this.validarFechas()) {
            this.msgs.push({
                severity: 'error',
                summary: 'Runakuna Error',
                detail: 'La fecha fin no puede ser mayor a la fecha de inicio.'
            });
            return;
        }
        this.showLoading = true;
        this.licencia.documentos = this.view;
        this.licencia.periodoEmpleado = this.periodoEmpleadoActual;
        this.licencia.idEmpleado = this.empleado.idEmpleado;
        this.licencia.idAtendidoPor = this.historiaLaboralActual.idJefeInmediato;

        this.empleadoService.guardarLicenciaEmpleado(this.licencia).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaLicencias(data);
                    }, 2000);
                }
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );

    }

    onActualizarAnexarDocumentos(){
        if(this.licencia.nombreEmpleado === undefined || this.licencia.nombreEmpleado == null || this.licencia.nombreEmpleado==''){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese el nombre del Empleado.'});
            return;
        }

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        this.showLoading = true;
        this.licencia.documentos = this.view;
        this.licencia.periodoEmpleado = this.periodoEmpleadoActual;
        this.licencia.idEmpleado = this.empleado.idEmpleado;
        this.licencia.idAtendidoPor = this.historiaLaboralActual.idJefeInmediato;

        this.empleadoService.guardarLicenciaEmpleado(this.licencia).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
    }

    onAprobarLicenciaEmpleado(){
        this.licencia.estado='A';

        if(this.licencia.nombreEmpleado === undefined || this.licencia.nombreEmpleado == null || this.licencia.nombreEmpleado==''){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese el nombre del Empleado.'});
            return;
        }

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }

        this.showLoading = true;
        this.licencia.documentos = this.view;
        this.licencia.periodoEmpleado = this.periodoEmpleadoActual;
        this.licencia.idPeriodoEmpleado = this.periodoEmpleadoActual.idPeriodoEmpleado;
        this.licencia.idEmpleado = this.empleado.idEmpleado;
        this.licencia.idAtendidoPor = this.historiaLaboralActual.idJefeInmediato;

        this.empleadoService.aprobarLicenciaEmpleado(this.licencia).subscribe(
            data => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaLicencias(data);
                    }, 3000);
                }
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
    }

    onValidarLicenciaEmpleado(){
        this.licencia.estado='V';
        if(this.licencia.nombreEmpleado === undefined || this.licencia.nombreEmpleado == null || this.licencia.nombreEmpleado==''){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese el nombre del Empleado.'});
            return;
        }

        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        this.showLoading = true;
        this.onActualizarAnexarDocumentos();
            this.empleadoService.validarLicenciaEmpleado(this.licencia).subscribe(
                data => {
                    this.backendService.notification(this.msgs, data);

                    if (data.codigo == 1) {
                        setTimeout(() => {
                            this.navegarBusquedaLicencias(data);
                        }, 2000);
                    }
                    this.showLoading = false;
                },
                error => {
                    this.showLoading = false;
                    this.backendService.notification(this.msgs,error);
                }
            );
    }

    validarRequerido():boolean{

        let validacion = false;

        if(this.historiaLaboralActual.idJefeInmediato === undefined || this.historiaLaboralActual.idJefeInmediato == null){
            $('#idJefeInmediatoReq2').addClass('invalid').removeClass('required');
            $('#idJefeInmediatoReq2').parent().addClass('state-error').removeClass('state-success');
            $('#idJefeInmediatoReq2').css('border','2px solid red');
            validacion = true;
        }
        if(this.licencia.idTipoLicencia === undefined || this.licencia.idTipoLicencia == null){
            $('#idTipoLicenciaReq2').addClass('invalid').removeClass('required');
            $('#idTipoLicenciaReq2').parent().addClass('state-error').removeClass('state-success');
            $('#idTipoLicenciaReq2').css('border','2px solid red');
            validacion = true;
        }

        if(this.licencia.comentario=== undefined || this.licencia.comentario == null || this.licencia.comentario==''){
            $('#comentarioReq2').addClass('invalid').removeClass('required');
            $('#comentarioReq2').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.licencia.fechaInicio === undefined || this.licencia.fechaInicio == null || this.licencia.fechaInicio==''){
            $('#fechaInicioReq2').addClass('invalid').removeClass('required');
            $('#fechaInicioReq2').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.licencia.fechaFin === undefined || this.licencia.fechaFin == null || this.licencia.fechaFin==''){
            $('#fechaFinReq2').addClass('invalid').removeClass('required');
            $('#fechaFinReq2').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    onRechazar() {
        this.licencia.estado='R';
        this.onRegistrarLicenciaEmpleado();
    }

    private obtenerHistoriaLaboralActual(empleado: Empleado) {
        this.showLoading = true;
        this.permisoService.obtenerHistoriaLaboralActual(empleado).subscribe(
            historiaLaboral => {
                this.historiaLaboralActual = historiaLaboral;this.historiaLaboralActual.idJefeInmediato = this.licencia.idAtendidoPor;
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            });
    }

    private obtenerHistoriaLaboralLicencia(busquedaLicencia: LicenciaFilter) {
        this.showLoading = true;
        this.permisoService.obtenerHistoriaLaboralLicencia(busquedaLicencia).subscribe(
            historiaLaboral => {
                this.navegarDashboardLicencia(historiaLaboral);
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            });
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
                this.backendService.notification(this.msgs,error);
            });
    }

    goBack(): void {
        this.location.back();
    }

    /* NOTIFICATION */
    navegarDashboardLicencia(data:HistorialLaboral){
        this.historiaLaboralActual.jefeInmediato = data.jefeInmediato;
        if(data.jefeInmediato == null){
            this.mensaje = 'No esta asignado a un Jefe Inmediato';
            this.historiaLaboralActual.jefeInmediato == null;
        }

        else if(data.jefeInmediato != null){
            this.mensaje = 'Jefe Inmediato es'+data.jefeInmediato;
        }
    }

    onChangeHoraInicio(value){
        this.licencia.horaInicio = value;
        $('#horaInicio2').removeClass('state-error');
        $('#horaInicio2').parent().removeClass('state-error');
    }

    onChangeHoraFin(value){
        this.licencia.horaFin = value;
        $('#horaFin2').removeClass('state-error');
        $('#horaFin2').parent().removeClass('state-error');
    }

    private pageChangeDocumentoLicencia(event: PageChangeEvent): void {
        this.skip = event.skip;
    }

    navegarBusquedaLicencias(data:NotificacionResult){
        this.location.back();
    }

    onRegresarBusquedaLicencia(){
        this.location.back();
    }

    @ViewChild(EditarConsultaLicenciaAnexar) protected editFormComponent: EditarConsultaLicenciaAnexar;

    public agregarDocumento(): void{
        this.editFormComponent.titulo = "Agregar";
        this.editFormComponent.agregarDocumento();
    }

    public showMessageLicencia(){
        if(this.validarRequerido()){
            this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }else{
            this.confirmActive= true;
        }
    }
    onActualizarLicenciaEmpleado(){
        this.showLoading  = true;
        this.licencia.periodoEmpleado = this.periodoEmpleadoActual;
        this.licencia.documentos = this.view;
        this.licencia.idEmpleado = this.empleado.idEmpleado;
        this.licencia.idAtendidoPor = this.historiaLaboralActual.idJefeInmediato;

        this.empleadoService.guardarLicenciaEmpleado(this.licencia).subscribe(
            data => {
                this.confirmActive=false;
                this.backendService.notification(this.msgs, data);
                if (data.codigo == 1) {
                    $('#btnGuardar').prop("disabled",true);
                    setTimeout(() => {
                        this.location.back();
                    }, 1500);
                }
                this.showLoading  = false;
            },
            error =>{
                this.showLoading  = false;
                this.confirmActive=false;
                this.backendService.notification(this.msgs, error);
            }

        );

    }

}
