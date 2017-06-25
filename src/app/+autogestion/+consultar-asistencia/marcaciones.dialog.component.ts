import { Component, Input,  Output, EventEmitter} from '@angular/core';
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PermisoService} from "../../+common/service/permiso.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Marcacion} from "../../+dto/maintenance/marcacion";
import {SolicitudCambioMarcacion} from "../../+dto/maintenance/solicitudCambioMarcacion";
import {Empleado} from "../../+dto/maintenance/empleado";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import {BackendService} from "../../+rest/backend.service";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";

declare var $: any;

@Component({
    selector: 'marcacion-dialog-form',
    template: `
        <kendo-dialog *ngIf="active" (close)="onClose()" >
            <kendo-dialog-titlebar>
                {{tituloCabecera}}
            </kendo-dialog-titlebar>
            <div class="modal-body">
                <div class="smart-form" style="width: 900px;">
                    <div class="row">
                        <div class="col-md-12">
                            <section class="col col-md-3">
                                <label>Fecha</label>
                                <label class="input state-disabled">
                                    <i class="icon-append fa fa-calendar"></i>
                                    <input type="text"   [(ngModel)]="fechaMarcacion" saUiDatepicker date-format="dd/MM/yy" disabled="disabled"/>
                                </label>
                            </section>
                        </div>
                        <div class="col-md-12">
                            <section class="col col-md-3">
                                <label>Hora Ingreso</label>
                                <label class="input state-disabled">
                                    <input type="text" [(ngModel)]="horaIngreso" disabled="disabled"/>
                                </label>
                            </section>
                            <section class="col col-md-3">
                                <label>Hora Inicio Almuerzo</label>
                                <label class="input state-disabled">
                                    <input type="text" [(ngModel)]="horaInicioAlmuerzo" disabled="disabled"/>
                                </label>
                            </section>
                            <section class="col col-md-3">
                                <label>Hora Fin Almuerzo</label>
                                <label class="input state-disabled">
                                    <input type="text" [(ngModel)]="horaFinAlmuerzo" disabled="disabled"/>
                                </label>
                            </section>
                            <section class="col col-md-3">
                                <label>Hora Salida</label>
                                <label class="input state-disabled">
                                    <input type="text" [(ngModel)]="horaSalida" disabled="disabled"/>
                                </label>
                            </section>
                        </div>
                    </div>
                    
                    <kendo-tabstrip>
                        <kendo-tabstrip-tab [title]="'Solicitar Cambio'" [selected]="true">
                            <template kendoTabContent>
                                <div class="row" *ngIf="!tieneSolicitud">
    
                                    <div class="col-md-12" >
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarIngreso" (change)="cambiarHoraIngreso($event)"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Ingreso<span style="color: red">*</span></label>
                                            <label [class]="!isCheckedHoraIngreso?'input state-disabled':'input'">
                                                <p-inputMask id="horaIngreso" mask="99:99" [(ngModel)]="horaIngresoSolicitud" placeholder="00:00" [disabled]="!isCheckedHoraIngreso" (keyup)="ingresaHoraIngreso()"></p-inputMask>
            
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Raz&oacute;n de Cambio</label>
                                            <label [class]="!isCheckedHoraIngreso?'input state-disabled':'input'">
                                                <input type="text" [(ngModel)]="razonCambioHoraIngreso" [disabled]="!isCheckedHoraIngreso"/>
                                            </label>
                                        </section>
                                    </div>
            
                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarInicioAlmuerzo" (change)="cambiarHoraIniAlmuerzo($event)"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Inicio Almuerzo<span style="color: red">*</span></label>
                                            <label [class]="!isCheckedHoraIniAlmuerzo?'input state-disabled':'input'">
                                                <p-inputMask id="horaInicioAlmuerzo" mask="99:99" [(ngModel)]="horaInicioAlmuerzoSolicitud" placeholder="00:00" [disabled]="!isCheckedHoraIniAlmuerzo" (keyup)="ingresaHoraInicioAlmuerzo()"></p-inputMask>
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Raz&oacute;n de Cambio</label>
                                            <label [class]="!isCheckedHoraIniAlmuerzo?'input state-disabled':'input'">
                                                <input type="text" [(ngModel)]="razonCambioHoraInicioAlmuerzo"  [disabled]="!isCheckedHoraIniAlmuerzo"/>
                                            </label>
                                        </section>
                                    </div>
            
                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarFinAlmuerzo" (change)="cambiarHoraFinAlmuerzo($event)"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Fin Almuerzo<span style="color: red">*</span></label>
                                            <label [class]="!isCheckedHoraFinAlmuerzo?'input state-disabled':'input'">
                                                <p-inputMask id="horaFinAlmuerzo" mask="99:99" [(ngModel)]="horaFinAlmuerzoSolicitud" placeholder="00:00" [disabled]="!isCheckedHoraFinAlmuerzo" (keyup)="ingresaHoraFinAlmuerzo()"></p-inputMask>
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Raz&oacute;n de Cambio</label>
                                            <label [class]="!isCheckedHoraFinAlmuerzo?'input state-disabled':'input'">
                                                <input type="text" [(ngModel)]="razonCambioHoraFinAlmuerzo" [disabled]="!isCheckedHoraFinAlmuerzo"/>
                                            </label>
                                        </section>
            
                                    </div>
            
                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarSalida" (change)="cambiarHoraSalida($event)"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Salida<span style="color: red">*</span></label>
                                            <label [class]="!isCheckedHoraSalida?'input state-disabled':'input'">
                                                <p-inputMask id="horaSalida" mask="99:99" [(ngModel)]="horaSalidaSolicitud" placeholder="00:00" [disabled]="!isCheckedHoraSalida" (keyup)="ingresaHoraSalida()"></p-inputMask>
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Raz&oacute;n de Cambio</label>
                                            <label [class]="!isCheckedHoraSalida?'input state-disabled':'input'">
                                                <input type="text" [(ngModel)]="razonCambioHoraSalida" [disabled]="!isCheckedHoraSalida"/>
                                            </label>
                                        </section>
                                    </div>
                                </div>
                                
                                <div class="row" *ngIf="tieneSolicitud">
            
                                    <div class="col-md-12" >
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarIngreso" disabled="disabled"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Ingreso</label>
                                            <label class="input state-disabled">
                                                <p-inputMask id="horaIngreso" mask="99:99" [(ngModel)]="horaIngresoSolicitud" placeholder="00:00" disabled="disabled"></p-inputMask>
            
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Raz&oacute;n de Cambio</label>
                                            <label class="input state-disabled">
                                                <input type="text" [(ngModel)]="razonCambioHoraIngreso" disabled="!disabled"/>
                                            </label>
                                        </section>
                                    </div>
            
                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarInicioAlmuerzo" disabled="disabled"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Inicio Almuerzo</label>
                                            <label class="input state-disabled">
                                                <p-inputMask id="horaInicioAlmuerzo" mask="99:99" [(ngModel)]="horaInicioAlmuerzoSolicitud" placeholder="00:00" disabled="disabled"></p-inputMask>
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Raz&oacute;n de Cambio</label>
                                            <label class="input state-disabled">
                                                <input type="text" [(ngModel)]="razonCambioHoraInicioAlmuerzo"  disabled="disabled"/>
                                            </label>
                                        </section>
                                    </div>
            
                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarFinAlmuerzo" disabled="disabled"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Fin Almuerzo</label>
                                            <label class="input state-disabled">
                                                <p-inputMask id="horaFinAlmuerzo" mask="99:99" [(ngModel)]="horaFinAlmuerzoSolicitud" placeholder="00:00" disabled="disabled"></p-inputMask>
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Raz&oacute;n de Cambio</label>
                                            <label class="input state-disabled">
                                                <input type="text" [(ngModel)]="razonCambioHoraFinAlmuerzo" disabled="disabled"/>
                                            </label>
                                        </section>
            
                                    </div>
            
                                    <div class="col-md-12">
                                        <section class="col col-md-2">
                                            <label>Cambiar</label>
                                            <label class="select">
                                                <input type="checkbox" [(ngModel)]="cambiarSalida" disabled="disabled"/>
                                            </label>
                                        </section>
                                        <section class="col col-md-3">
                                            <label>Hora Salida</label>
                                            <label class="input state-disabled">
                                                <p-inputMask id="horaSalida" mask="99:99" [(ngModel)]="horaSalidaSolicitud" placeholder="00:00" disabled="disabled"></p-inputMask>
                                            </label>
                                        </section>
                                        <section class="col col-md-7">
                                            <label>Raz&oacute;n de Cambio</label>
                                            <label class="input state-disabled">
                                                <input type="text" [(ngModel)]="razonCambioHoraSalida" disabled="disabled"/>
                                            </label>
                                        </section>
                                    </div>
                                </div>
                            </template>
                        </kendo-tabstrip-tab>
                        
                        <kendo-tabstrip-tab [title]="'Registro de Marcaciones'">
                            <template kendoTabContent>
                                <kendo-grid
                                      [data]="gridViewRegistroMarcacion"
                                      [pageSize]="pageSizeRegistroMarcacion"
                                      [skip]="skipRegistroMarcacion"
                                      [pageable]="true"
                                      (pageChange)="pageChangeRegistroMarcacion($event)">

                                       <kendo-grid-column field="hora" title="Hora" width="40px">
                                       </kendo-grid-column>
                                       <kendo-grid-column field="tipo" title="Tipo" width="40px">
                                       </kendo-grid-column>
                                       <kendo-grid-column field="sensor" title="Sensor" width="40px">
                                       </kendo-grid-column>
                                 </kendo-grid>
                            </template>
                        </kendo-tabstrip-tab>
                            
                    </kendo-tabstrip>
                     
                </div>
            </div>
            <div class="modal-footer">
                <a (click)="onSolicitarCambioMarcacion($event)" class="btn btn-primary" *ngIf="!tieneSolicitud"> Guardar</a>
                <a (click)="onCancel($event)" class="btn btn-default"> Cerrar</a>
            </div>
        </kendo-dialog>
    `
})
export class MarcacionesDialogFormComponent {

    public nombreEmpleado:string;
    public nombreProyecto:string;
    public fechaMarcacion:string;
    public horaIngreso:string;
    public horaInicioAlmuerzo:string;
    public horaFinAlmuerzo:string;
    public horaSalida:string;

    public idAtendidoPor:number;

    public isCheckedHoraIngreso:boolean=false;
    public isCheckedHoraIniAlmuerzo:boolean=false;
    public isCheckedHoraFinAlmuerzo:boolean=false;
    public isCheckedHoraSalida:boolean=false;

    public cambiarIngreso: boolean=false;
    public cambiarInicioAlmuerzo: boolean=false;
    public cambiarFinAlmuerzo: boolean=false;
    public cambiarSalida: boolean=false;

    public horaIngresoSolicitud: string;
    public horaInicioAlmuerzoSolicitud: string;
    public horaFinAlmuerzoSolicitud: string;
    public horaSalidaSolicitud: string;

    public razonCambioHoraIngreso: string;
    public razonCambioHoraInicioAlmuerzo: string;
    public razonCambioHoraFinAlmuerzo: string;
    public razonCambioHoraSalida: string;

    public idEmpleado:number;

    public tieneSolicitud:boolean = false;

    private historiasLaboralesActuales: HistorialLaboral[] = [];

    dataItemMarcacion:Marcacion;
    editForm;

    @Input() public set model(dto: Marcacion) {
        this.dataItemMarcacion = dto;
        if(dto === undefined){
            this.active=false;
        }else{
            this.active=true;
            this.obtenerGridRegistroMarcacion();
        }
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();

    constructor(private empleadoService:EmpleadoService,
                private backendService: BackendService,
                private permisoService:PermisoService) {
    }

    public active: boolean = false;

    public tituloCabecera:string="Solicitar Cambio Marcaci\u00f3n";


    private  gridViewRegistroMarcacion: GridDataResult;

    private pageSizeRegistroMarcacion: number = 5;
    private skipRegistroMarcacion: number = 0;

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    public onClose(): void {
        this.closeForm();
    }

    public closeForm(){
        this.active = false;
        this.cancel.emit();
    }

    public obtenerJefeInmediatoMarcaciones() {
        let empleado:Empleado= new Empleado();
        empleado.idEmpleado=this.idEmpleado;

        this.permisoService.obtenerHistoriasLaboralesActualPorEmpleado(empleado).subscribe(
            historiaLaboral => this.historiasLaboralesActuales = historiaLaboral,
            error =>  {
                this.backendService.handleError(error);
            }
        );
    }

    onSolicitarCambioMarcacion(e){

        let solicitudCambioMarcacion:SolicitudCambioMarcacion = new SolicitudCambioMarcacion();

        solicitudCambioMarcacion.idMarcacion = this.dataItemMarcacion.idMarcacion;

        if(this.cambiarIngreso){

            if(this.horaIngresoSolicitud == undefined ||
                this.horaIngresoSolicitud == null || this.horaIngresoSolicitud == '') {
                $('#horaIngreso').parent().addClass('state-error').removeClass('state-success');

                return;
            }
            solicitudCambioMarcacion.horaIngreso = this.horaIngresoSolicitud;
            solicitudCambioMarcacion.razonCambioHoraIngreso = this.razonCambioHoraIngreso;
        }
        solicitudCambioMarcacion.cambiarIngreso = this.cambiarIngreso;

        if(this.cambiarInicioAlmuerzo){
            if(this.horaInicioAlmuerzoSolicitud == undefined ||
                this.horaInicioAlmuerzoSolicitud == null || this.horaInicioAlmuerzoSolicitud == '') {

                $('#horaInicioAlmuerzo').parent().addClass('state-error').removeClass('state-success');
                return;
            }
            solicitudCambioMarcacion.horaInicioAlmuerzo = this.horaInicioAlmuerzoSolicitud;
            solicitudCambioMarcacion.razonCambioHoraInicioAlmuerzo = this.razonCambioHoraInicioAlmuerzo;
        }
        solicitudCambioMarcacion.cambiarInicioAlmuerzo = this.cambiarInicioAlmuerzo;

        if(this.cambiarFinAlmuerzo){
            if(this.horaFinAlmuerzoSolicitud == undefined ||
                this.horaFinAlmuerzoSolicitud == null || this.horaFinAlmuerzoSolicitud == '') {
                $('#horaFinAlmuerzo').parent().addClass('state-error').removeClass('state-success');

                return;
            }
            solicitudCambioMarcacion.horaFinAlmuerzo = this.horaFinAlmuerzoSolicitud;
            solicitudCambioMarcacion.razonCambioHoraFinAlmuerzo = this.razonCambioHoraFinAlmuerzo;
        }
        solicitudCambioMarcacion.cambiarFinAlmuerzo = this.cambiarFinAlmuerzo;

        if(this.cambiarSalida){
            if(this.horaSalidaSolicitud == undefined ||
                this.horaSalidaSolicitud == null || this.horaSalidaSolicitud == '') {
                $('#horaSalida').parent().addClass('state-error').removeClass('state-success');
                return;
            }
            solicitudCambioMarcacion.horaSalida = this.horaSalidaSolicitud;
            solicitudCambioMarcacion.razonCambioHoraSalida = this.razonCambioHoraSalida;
        }
        solicitudCambioMarcacion.cambiarSalida = this.cambiarSalida;

        this.dataItemMarcacion.solicitudCambio = 'Si';

        this.empleadoService.solicitarCambioMarcacion(solicitudCambioMarcacion).subscribe(
            data => {
                this.guardarFilaGrilla(data);
            },
            error => {
                this.backendService.handleError(error);
            }
        );

    }

    guardarFilaGrilla(notificacion:NotificacionResult){
        if(notificacion.codigo == 1){
            this.save.emit(this.dataItemMarcacion);
            this.active = false;
        }else{
            this.closeForm();
        }
    }

    validarRequerido():boolean{
        let validacion = false;
        if(this.horaIngresoSolicitud === undefined || this.horaIngresoSolicitud == null || this.horaIngresoSolicitud=='' ){
            $('#horaIngreso').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.horaInicioAlmuerzoSolicitud === undefined || this.horaInicioAlmuerzoSolicitud == null || this.horaInicioAlmuerzoSolicitud==''){
            $('#horaInicioAlmuerzo').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.horaFinAlmuerzoSolicitud === undefined || this.horaFinAlmuerzoSolicitud == null || this.horaFinAlmuerzoSolicitud==''){
            $('#horaFinAlmuerzo').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.horaSalidaSolicitud === undefined || this.horaSalidaSolicitud == null || this.horaSalidaSolicitud==''){
            $('#horaSalida').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        return validacion;
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
        this.horaIngresoSolicitud = value;
    }

    onChangeHoraInicioAlmuerzo(value){
        this.horaInicioAlmuerzoSolicitud = value;
    }

    onChangeHoraFinAlmuerzo(value){
        this.horaFinAlmuerzoSolicitud = value;
    }

    onChangeHoraSalida(value){
        this.horaSalidaSolicitud = value;
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

    public incializarSolicitud(){
        this.nombreEmpleado = undefined;
        this.fechaMarcacion = undefined;
        this.horaIngreso = undefined;
        this.horaInicioAlmuerzo = undefined;
        this.horaFinAlmuerzo = undefined;
        this.horaSalida = undefined;
        this.idEmpleado = undefined;

        this.horaIngresoSolicitud = undefined;
        this.horaInicioAlmuerzoSolicitud = undefined;
        this.horaFinAlmuerzoSolicitud = undefined;
        this.horaSalidaSolicitud = undefined;

        this.cambiarIngreso = false;
        this.cambiarInicioAlmuerzo = false;
        this.cambiarFinAlmuerzo = false;
        this.cambiarSalida = false;

        this.razonCambioHoraIngreso = undefined;
        this.razonCambioHoraInicioAlmuerzo = undefined;
        this.razonCambioHoraFinAlmuerzo = undefined;
        this.razonCambioHoraSalida = undefined;

        this.isCheckedHoraIngreso = false;
        this.isCheckedHoraIniAlmuerzo = false;
        this.isCheckedHoraFinAlmuerzo = false;
        this.isCheckedHoraSalida = false;

        this.tieneSolicitud = false;
    }

    public obtenerGridRegistroMarcacion():void{

        if(this.dataItemMarcacion.registrosMarcaciones.length>0){
            this.gridViewRegistroMarcacion= {
                data: this.dataItemMarcacion.registrosMarcaciones.slice(this.skipRegistroMarcacion, this.skipRegistroMarcacion + this.pageSizeRegistroMarcacion),
                total: this.dataItemMarcacion.registrosMarcaciones.length
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

}