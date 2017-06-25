import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {PermisoEmpleado} from "../../+dto/maintenance/permisoEmpleado";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisService} from "../../+common/service/pais.service";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {PermisosDialogFormComponent} from "./permisos.dialog.component";
import {ComponentBase} from "../../+common/service/componentBase";
import {VacacionService} from "../../+common/service/vacacion.service";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {LicenciaService} from "../../+common/service/licencia.service";

import {BackendService} from "../../+rest/backend.service";
import {Router} from "@angular/router";

declare var $: any;

var moment = require('moment');

@Component({
    selector: 'sa-consultar-permiso',
    templateUrl: 'consultar.permiso.component.html',
    providers: [PaisService,VacacionService,HorasExtraService,LicenciaService],
})
export class ConsultarPermisoComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
    public defaultItemPeriodo={idPeriodoEmpleado:null,periodo:'Todos'};
    private empleado:Empleado = new Empleado();
    private permisosEmpleados:PermisoEmpleado[]=[];
    private periodoEmpleadoPermiso:PeriodoEmpleado = new PeriodoEmpleado();
    private periodosEmpleados:PeriodoEmpleado[]=[];
    private idPeriodoEmpleadoPermiso:number;
    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    constructor(private empleadoService:EmpleadoService,
                public backendService: BackendService,
                private _router: Router) {
        super(backendService,'AU001');
    }

    ngOnInit() {
        this.showLoading = true;
        let idEmpleado = this.currentUser.idEmpleado;
        this.cargarInformacion(idEmpleado);
        this.cargarPermisoEmpleado(this.periodoEmpleadoPermiso);
    }

    cargarInformacion(idEmpleado:number){
        this.cargarinformacionEmpelado(idEmpleado);
        this.periodoEmpleadoPermiso.idEmpleado = idEmpleado;
        this.cargarPermisoEmpleado(this.periodoEmpleadoPermiso);
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

    cargarPermisoEmpleado(periodoEmpleado: PeriodoEmpleado){
        this.showLoading = true;
        this.empleadoService.verPermisoEmpleado(periodoEmpleado).subscribe(
            data => {this.permisosEmpleados = data;
                this.obtenerGridPermisoEmpleado();
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
    }

    onChangePermisoEmpleadoPorPeriodo(value){
        this.periodoEmpleadoPermiso.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleadoPermiso.idPeriodoEmpleado = value;
        this.cargarPermisoEmpleado(this.periodoEmpleadoPermiso);

    }

    solicitarPermiso(){
        this._router.navigate(['/autogestion/solicitarPermiso']);
    }

    cargarEmpleado(data:Empleado){

        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;
        if(data.fotoPerfil != null) {
            this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
            $('#iconPerson').prop("class","");
        }

        this.empleado = data;
        this.showLoading = false;

    }

    //permiso empleado
    public dataItemPermisoEmpleado: PermisoEmpleado;

    gridViewPermisoEmpleado: GridDataResult;

    private pageSizePermisoEmpleado: number = 10;
    private skipPermisoEmpleado: number = 0;

    @ViewChild(PermisosDialogFormComponent) protected editPermisosFormComponent: PermisosDialogFormComponent;

    public onEditarPermisoEmpleado(dataItem: any, title: string): void {

        this.editPermisosFormComponent.tituloCabecera = title;

        this.editPermisosFormComponent.obtenerMotivo();

        this.dataItemPermisoEmpleado = dataItem;

        if(this.dataItemPermisoEmpleado.estado == 'P'){
            this.editPermisosFormComponent.isEnviado=false;
            this.editPermisosFormComponent.enviadoClass='input';
        }else {
            this.editPermisosFormComponent.isEnviado=true;
            this.editPermisosFormComponent.enviadoClass='input state-disabled';
        }

        if(this.dataItemPermisoEmpleado.motivo == 'P'){
            this.editPermisosFormComponent.isCompensarhoras=false;
            this.editPermisosFormComponent.isNoRecuperable = false;
        }else{
            this.editPermisosFormComponent.isCompensarhoras=true;
            if(this.dataItemPermisoEmpleado.motivo == 'N'){
                this.editPermisosFormComponent.isNoRecuperable = true;
            }else{
                this.editPermisosFormComponent.isNoRecuperable = false;
            }

        }

        this.editPermisosFormComponent.motivo = this.dataItemPermisoEmpleado.motivo;
        this.editPermisosFormComponent.razon = this.dataItemPermisoEmpleado.razon;
        this.editPermisosFormComponent.fechaPermiso = this.dataItemPermisoEmpleado.fecha;
        this.editPermisosFormComponent.horaDesdePermiso = this.dataItemPermisoEmpleado.horaInicio;
        this.editPermisosFormComponent.horaHastaPermiso = this.dataItemPermisoEmpleado.horaFin;
        this.editPermisosFormComponent.fechaRecuperacion = this.dataItemPermisoEmpleado.fechaRecuperacion;
        this.editPermisosFormComponent.horaDesdeRecuperacion = this.dataItemPermisoEmpleado.horaInicioRecuperacion== null ? '' : this.dataItemPermisoEmpleado.horaInicioRecuperacion;
        this.editPermisosFormComponent.horaHastaRecuperacion = this.dataItemPermisoEmpleado.horaFinRecuperacion== null ? '' :  this.dataItemPermisoEmpleado.horaFinRecuperacion;
        this.editPermisosFormComponent.nombreEstado = this.dataItemPermisoEmpleado.nombreEstado;
        this.editPermisosFormComponent.estado = this.dataItemPermisoEmpleado.estado;
        this.editPermisosFormComponent.jefeInmediato = this.dataItemPermisoEmpleado.jefeInmediato;
        this.editPermisosFormComponent.periodo = this.dataItemPermisoEmpleado.periodo;

        this.editPermisosFormComponent.horas = this.dataItemPermisoEmpleado.horas;
        this.editPermisosFormComponent.diaEntero = this.dataItemPermisoEmpleado.diaEntero;

    }

    public onCancelarPermisoEmpleado(): void {
        this.dataItemPermisoEmpleado = undefined;
    }

    public onAgregarPermisoEmpleado(dto: PermisoEmpleado): void {
        this.cargarPermisoEmpleado(this.periodoEmpleadoPermiso);
    }

    public onEliminarPermisoEmpleado(e: PermisoEmpleado): void {
        this.showLoading = true;
        this.empleadoService.eliminarPermisoEmpleado(e).subscribe(
            (data:NotificacionResult) => {
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.cargarPermisoEmpleado(this.periodoEmpleadoPermiso);
                }
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    public editarPermisoEmpleado(data: PermisoEmpleado): Observable<PermisoEmpleado[]> {
        return this.fetchPermisoEmpleado("update", data);
    }

    public eliminarPermisoEmpleado(data: PermisoEmpleado): Observable<PermisoEmpleado[]> {
        return this.fetchPermisoEmpleado("destroy", data);
    }

    private fetchPermisoEmpleado(action: string = "", data?: PermisoEmpleado): Observable<PermisoEmpleado[]>  {

        if(action=="update"){
            var indice = this.permisosEmpleados.indexOf(data);
            if(indice>=0)
                this.permisosEmpleados[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.permisosEmpleados.indexOf(data);

            if(indice>=0)
                this.permisosEmpleados.splice(indice, 1);

        }

        return Observable.of(this.permisosEmpleados);
    }

    obtenerGridPermisoEmpleado():void{
        if(this.permisosEmpleados.length>0){
            this.gridViewPermisoEmpleado = {
                data: this.permisosEmpleados.slice(this.skipPermisoEmpleado, this.skipPermisoEmpleado + this.pageSizePermisoEmpleado),
                total: this.permisosEmpleados.length
            };
        }else{
            this.gridViewPermisoEmpleado = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangePermisoEmpleado(event: PageChangeEvent): void {
        this.skipPermisoEmpleado = event.skip;
        this.obtenerGridPermisoEmpleado();

    }

}
