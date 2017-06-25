import { Component, Input,  Output, EventEmitter} from '@angular/core';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {PermisoService} from "../../+common/service/permiso.service";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {StorageResult} from "../../+dto/storageResult";
import {BackendService} from "../../+rest/backend.service";

declare var $: any;
var moment = require('moment');

@Component({
  selector: 'permiso-dialog-form',
  template: `
      <kendo-dialog *ngIf="active" (close)="onClose()" >
          <kendo-dialog-titlebar>
              {{tituloCabecera}}
          </kendo-dialog-titlebar>
          <div class="well modal-body">
              <div class="smart-form" style="width: 900px;">
                  <div class="row">
                      <section class="col col-md-4">
                          <label>Jefe Inmediato</label>
                          <label class="input state-disabled">
                              <input type="text" [(ngModel)]="jefeInmediato" disabled="disabled" />
                          </label>
                      </section>
                      <section class="col col-md-8">
                          <label>Periodo</label>
                          <label class="input state-disabled">
                              <input type="text" [(ngModel)]="periodo" disabled="disabled"/>
                          </label>
                      </section>
                      <section class="col col-md-4">
                          <label>Motivo</label>
                          <label class="input">
                              <kendo-dropdownlist [data]="motivos" id="motivo" [textField]="'nombre'"
                                                  [valueField]="'codigo'" [defaultItem]="defaultItem" [(value)]="motivo"
                                                  [valuePrimitive]="true" style="width: 100%;"  (selectionChange)="cargarMotivo($event)" [disabled]="isEnviado">
                                  <ng-template kendoDropDownListNoDataTemplate></ng-template>
                              </kendo-dropdownlist>
                          </label>
                      </section>
                      <section class="col col-md-8">
                          <label>Razon</label>
                          <label [class]="enviadoClass">
                              <input type="text" [(ngModel)]="razon" [disabled]="isEnviado">
                          </label>
                      </section>
                      <div class="col-md-12">
                          <section class="col col-md-4">
                              <label>Fecha Permiso</label>
                              <label [class]="enviadoClass">
                                  <i class="icon-append fa fa-calendar"></i>
                                  <input type="text" saUiDatepicker date-format="dd/MM/yy"
                                         placeholder="Seleccionar una Fecha"
                                         [(ngModel)]="fechaPermiso" (change)="onChangeFecha($event)" readonly="readonly" [disabled]="isEnviado"/>
                              </label>
                          </section>
                          <section class="col col-md-2" *ngIf="isCompensarhoras">
                              <label>Todo el d&iacute;a</label>
                              <label class="select">
                                  <input type="checkbox" [(ngModel)]="diaEntero" [disabled]="tituloCabecera == 'Ver'">
                              </label>
                          </section>
                          <section class="col col-md-2" *ngIf="!diaEntero">
                              <label>Desde (hh:mm)</label>
                              <label [class]="enviadoClass">
                                  <p-inputMask mask="99:99" [(ngModel)]="horaDesdePermiso" placeholder="00:00" [disabled]="isEnviado"></p-inputMask>
                              </label>
                          </section>
                          <section class="col col-md-2" *ngIf="!diaEntero">
                              <label>Hasta (hh:mm)</label>
                              <label [class]="enviadoClass">
                                  <p-inputMask mask="99:99" (ngModelChange)="onChangeHoraFin($event)" [(ngModel)]="horaHastaPermiso" placeholder="00:00" [disabled]="isEnviado"></p-inputMask>
                              </label>
                          </section>
                          <section class="col col-md-2" *ngIf="isCompensarhoras">
                              <label>Total de Horas</label>
                              <label class="input state-disabled">
                                  <input type="text" [(ngModel)]="horas" disabled="disabled"/>
                              </label>
                          </section>
                      </div>
                      <div class="col-md-12" *ngIf="!isCompensarhoras">
                          <section class="col col-md-4">
                              <label>Fecha de Recuperacion</label>
                              <label [class]="enviadoClass">
                                  <i class="icon-append fa fa-calendar"></i>
                                  <input type="text"  saUiDatepicker date-format="dd/MM/yy"
                                         placeholder="Seleccionar una Fecha" [(ngModel)]="fechaRecuperacion"
                                         (change)="onChangeFechaRecuperacion($event)" readonly="readonly" [disabled]="isEnviado"/>
                              </label>
                          </section>
                          <section class="col col-md-2">
                              <label>Desde</label>
                              <label [class]="enviadoClass">
                                  <p-inputMask mask="99:99" [(ngModel)]="horaDesdeRecuperacion" placeholder="00:00" [disabled]="isEnviado"></p-inputMask>
                              </label>
                          </section>
                          <section class="col col-md-2">
                              <label>Hasta</label>
                              <label [class]="enviadoClass">
                                  <p-inputMask mask="99:99" [(ngModel)]="horaHastaRecuperacion" placeholder="00:00" [disabled]="isEnviado"></p-inputMask>
                              </label>
                          </section>
                      </div>
                      <div class="col-md-12" *ngIf="isCompensarhoras && !isNoRecuperable">
                          <section class="col col-md-4">
                              <label>Horas por Compensar</label>
                              <label class="input state-disabled">
                                  <input type="text" disabled="disabled"/>
                              </label>
                          </section>
                      </div>
                      <div class="col-md-12">
                          <section class="col col-md-4">
                              <label>Estado</label>
                              <label class="input state-disabled">
                                  <input type="text" [(ngModel)]="nombreEstado" disabled="disabled">
                              </label>
                          </section>
                          <section class="col col-md-8">
                              <label>Comentario Jefe Inmediato</label>
                              <label class="input state-disabled">
                                  <input type="text" disabled="disabled">
                              </label>
                          </section>
                      </div>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
              <a (click)="onEnviarPermisoEmpleado($event)" class="btn btn-primary" *ngIf="!isEnviado"> Enviar Solicitud</a>
              <a (click)="onCancel($event)" class="btn btn-default" *ngIf="!isEnviado"> Cancelar</a>
              <a (click)="onCancel($event)" class="btn btn-default" *ngIf="isEnviado"> Cerrar</a>
          </div>
      </kendo-dialog>

  `
})
export class PermisosDialogFormComponent {

  public jefeInmediato:string;
  public periodo:string;
  public nombreMotivo:string;
  public motivo:string;
  public razon:string;
  public fechaPermiso:string;
  public horaDesdePermiso:string;
  public horaHastaPermiso:string;
  public fechaRecuperacion:string;
  public horaDesdeRecuperacion:string;
  public horaHastaRecuperacion:string;
  public estado:string;
  public nombreEstado:string;
  public horas:number;
  public diaEntero:boolean;

  public mensaje:string;

  private motivos:TablaGeneralResult[];
  public isCompensarhoras:boolean=true;

  public isNoRecuperable:boolean=true;

  public isEnviado:boolean=true;
  public enviadoClass:string='input';

  dataItemPermisoEmpleado:PermisoEmpleado;
  editForm;

  @Input() public set model(dto: PermisoEmpleado) {
    this.dataItemPermisoEmpleado = dto;
    dto === undefined ? this.active=false: this.active=true;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();


  errorMessage: string;

  public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar',grupo:null};
  public storageCommomnValueResult: StorageResult = new StorageResult();

  constructor(private permisoService:PermisoService, private backendService: BackendService) {

    this.storageCommomnValueResult = JSON.parse(localStorage.getItem('localStorageCommonsValues'));

  }

  public active: boolean = false;

  public tituloCabecera:string="";

  public onCancel(e): void {
    e.preventDefault();
    this.closeForm();
  }

  public onClose(): void {
    this.closeForm();
  }

  onActualizarPermisoEmpleado(e){
    e.preventDefault();

    for(var item in this.motivos){
      var data = this.motivos[item];
      if(this.motivo===data.codigo){
        this.nombreMotivo = data.nombre;
        break;
      }
    }

    this.dataItemPermisoEmpleado.motivo = this.motivo;
    this.dataItemPermisoEmpleado.razon = this.razon;
    this.dataItemPermisoEmpleado.fecha = this.fechaPermiso;
    this.dataItemPermisoEmpleado.horaInicio = this.horaDesdePermiso;
    this.dataItemPermisoEmpleado.horaFin = this.horaHastaPermiso;
    this.dataItemPermisoEmpleado.fechaRecuperacion = this.fechaRecuperacion;
    this.dataItemPermisoEmpleado.horaInicioRecuperacion = this.horaDesdeRecuperacion;
    this.dataItemPermisoEmpleado.horaFinRecuperacion = this.horaHastaRecuperacion;
    this.dataItemPermisoEmpleado.estado = this.estado;

    let periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado();
    periodoEmpleado.idPeriodoEmpleado = this.dataItemPermisoEmpleado.idPeriodoEmpleado;

    this.dataItemPermisoEmpleado.periodoEmpleado = periodoEmpleado;

    let fechaAct:Date = new Date();

    if(this.validarRequerido()){
      this.mensaje = 'Ingrese los campos obligatorios';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    let cadena:string[] = this.fechaPermiso.split('/');
    let horaIni:string[] = this.horaDesdePermiso.split(':');
    let horaFin:string[] = this.horaHastaPermiso.split(':');

    let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

    let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

    let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));


    if(fechaPerm<fechaAct){
      this.mensaje = 'La fecha del permiso debe ser mayor a la fecha de hoy.';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    if(fechaFin.getTime()<fechaIni.getTime()){
      this.mensaje = 'La hora final del permiso debe ser mayor a la hora inicial del permiso.';
      $( '#dialog-message-permiso' ).dialog( "open" );
      return;
    }

    let interval= fechaFin.getTime()- fechaIni.getTime();
    let hours:number = interval / (1000*60*60);
    this.dataItemPermisoEmpleado.horas = parseFloat(hours.toFixed(2));

    if( this.motivo == 'P'){
      if(this.validarRequeridoFechaRecuperacion()){
        this.mensaje = 'Ingrese los campos obligatorios de la Fecha de Recuperacion.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }

      let cadenaRecuperacion:string[] = this.fechaRecuperacion.split('/');
      let horaIniRecuperacion:string[] = this.horaDesdeRecuperacion.split(':');
      let horaFinRecuperacion:string[] = this.horaHastaRecuperacion.split(':');

      let fechaIniRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaIniRecuperacion[0]),parseInt(horaIniRecuperacion[1]));

      let fechaFinRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaFinRecuperacion[0]),parseInt(horaFinRecuperacion[1]));

      let fechaRec:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]));


      if(fechaRec<fechaAct){
        this.mensaje = 'La fecha de recuperacion debe ser mayor a la fecha de hoy.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }

      if(fechaFinRecuperacion.getTime()<fechaIniRecuperacion.getTime()){
        this.mensaje = 'La hora final de recuperacion debe ser mayor a la hora inicial de recuperacion.';
        $( '#dialog-message-permiso' ).dialog( "open" );
        return;
      }
    }
    this.permisoService.actualizarPermisoEmpleadoDatosPersonales(this.dataItemPermisoEmpleado).subscribe(
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
      this.save.emit(this.dataItemPermisoEmpleado);
      this.active = false;
    }else{
      this.closeForm();

    }
  }

  public closeForm(){
    this.active = false;
    this.cancel.emit();
  }

  onEnviarPermisoEmpleado(e){

    e.preventDefault();

    for(var item in this.motivos){
      var data = this.motivos[item];
      if(this.motivo===data.codigo){
        this.nombreMotivo = data.nombre;
        break;
      }
    }

    this.dataItemPermisoEmpleado.motivo = this.motivo;
    this.dataItemPermisoEmpleado.razon = this.razon;
    this.dataItemPermisoEmpleado.fecha = this.fechaPermiso;
    this.dataItemPermisoEmpleado.horaInicio = this.horaDesdePermiso;
    this.dataItemPermisoEmpleado.horaFin = this.horaHastaPermiso;
    this.dataItemPermisoEmpleado.fechaRecuperacion = this.fechaRecuperacion;
    this.dataItemPermisoEmpleado.horaInicioRecuperacion = this.horaDesdeRecuperacion;
    this.dataItemPermisoEmpleado.horaFinRecuperacion = this.horaHastaRecuperacion;
    this.dataItemPermisoEmpleado.estado = 'E';
    this.dataItemPermisoEmpleado.nombreEstado = 'Enviado';
    this.dataItemPermisoEmpleado.diaEntero = this.diaEntero;

    let periodoEmpleado:PeriodoEmpleado = new PeriodoEmpleado();
    periodoEmpleado.idPeriodoEmpleado = this.dataItemPermisoEmpleado.idPeriodoEmpleado;

    this.dataItemPermisoEmpleado.periodoEmpleado = periodoEmpleado;

    let fechaAct:Date = new Date();

    if(this.validarRequerido()){
      return;
    }

    let cadena:string[] = this.fechaPermiso.split('/');
    let horaIni:string[] = this.horaDesdePermiso.split(':');
    let horaFin:string[] = this.horaHastaPermiso.split(':');

    let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

    let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

    let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));


    /*if(fechaPerm<fechaAct){
     this.mensaje = 'La fecha del permiso debe ser mayor a la fecha de hoy.';

     return;
     }*/

    if(fechaFin.getTime()<fechaIni.getTime()){
      this.mensaje = 'La hora final del permiso debe ser mayor a la hora inicial del permiso.';

      return;
    }

    let interval= fechaFin.getTime()- fechaIni.getTime();
    let hours:number = interval / (1000*60*60);
    this.dataItemPermisoEmpleado.horas = parseFloat(hours.toFixed(2));

    if( this.motivo == 'P'){
      if(this.validarRequeridoFechaRecuperacion()){
        this.mensaje = 'Ingrese los campos obligatorios de la Fecha de Recuperacion.';

        return;
      }

      let cadenaRecuperacion:string[] = this.fechaRecuperacion.split('/');
      let horaIniRecuperacion:string[] = this.horaDesdeRecuperacion.split(':');
      let horaFinRecuperacion:string[] = this.horaHastaRecuperacion.split(':');

      let fechaIniRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaIniRecuperacion[0]),parseInt(horaIniRecuperacion[1]));

      let fechaFinRecuperacion:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]),parseInt(horaFinRecuperacion[0]),parseInt(horaFinRecuperacion[1]));

      let fechaRec:Date= new Date( parseInt(cadenaRecuperacion[2]),parseInt(cadenaRecuperacion[1])-1,parseInt(cadenaRecuperacion[0]));


      /*if(fechaRec<fechaAct){
       this.mensaje = 'La fecha de recuperacion debe ser mayor a la fecha de hoy.';

       return;
       }*/

      if(fechaFinRecuperacion.getTime()<fechaIniRecuperacion.getTime()){
        this.mensaje = 'La hora final de recuperacion debe ser mayor a la hora inicial de recuperacion.';

        return;
      }
    }


    this.permisoService.enviarPermisoEmpleadoDatosPersonales(this.dataItemPermisoEmpleado).subscribe(
        data => {
          this.guardarFilaGrilla(data);
        },
        error => {
          this.backendService.handleError(error);
        }
    );
  }

  cargarMotivo(value){
    if(value == 'P'){
      this.isCompensarhoras=false;
    }else{
      this.isCompensarhoras=true;
    }
  }


  validarRequerido():boolean{
    let validacion = false;

    return validacion;
  }

  validarRequeridoFechaRecuperacion():boolean{
    let validacion = false;
    return validacion;
  }

  public obtenerMotivo() {
    this.motivos = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Permiso.Tipo' === grupo.grupo);
  }

  onChangeFecha(value){
    this.fechaPermiso = value;
  }

  onChangeHoraInicio(value){
    this.horaDesdePermiso = value;
  }

  onChangeHoraFin(value){
    this.horaHastaPermiso = value;

    if(this.horaHastaPermiso!=null){
      this.calcularTotalHoras();
    }
  }

  calcularTotalHoras(){
    let cadena:string[] = moment().format('DD/MM/YYYY').split('/');
    let horaIni:string[] = this.horaDesdePermiso.split(':');
    let horaFin:string[] = this.horaHastaPermiso.split(':');

    let fechaIni:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaIni[0]),parseInt(horaIni[1]));

    let fechaFin:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]),parseInt(horaFin[0]),parseInt(horaFin[1]));

    let fechaPerm:Date= new Date( parseInt(cadena[2]),parseInt(cadena[1])-1,parseInt(cadena[0]));

    /*if(fechaFin.getTime()<fechaIni.getTime()){
     this.msgs.push({severity:'error', summary:'Runakuna Error', detail:'La hora final del permiso debe ser mayor a la hora inicial del permiso.'});
     return;
     }*/

    let interval= fechaFin.getTime()- fechaIni.getTime();
    let hours:number = interval / (1000*60*60);
    this.horas = parseFloat(hours.toFixed(2));
  }

  onChangeFechaRecuperacion(value){
    this.fechaRecuperacion = value;
  }
  onChangeHoraInicioRecuperacion(value){
    this.horaDesdeRecuperacion = value;
  }

  onChangeHoraFinRecuperacion(value){
    this.horaHastaRecuperacion = value;
  }

}