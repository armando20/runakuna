import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisService} from "../../+common/service/pais.service";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {ComponentBase} from "../../+common/service/componentBase";
import {VacacionService} from "../../+common/service/vacacion.service";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {LicenciaService} from "../../+common/service/licencia.service";
import {Licencia} from "../../+dto/maintenance/licencia";
import {LicenciaDialogFormComponent} from "./licencia.dialog.component";
import {BackendService} from "../../+rest/backend.service";
import {Router} from "@angular/router";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";

declare var $: any;

var moment = require('moment');

@Component({
    selector: 'sa-consultar-licencia',
    templateUrl: 'consultar.licencia.component.html',
    providers: [PaisService,VacacionService,HorasExtraService,LicenciaService],
})
export class ConsultarLicenciaComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
    public defaultItemPeriodo={idPeriodoEmpleado:null,periodo:'Todos'};
    private empleado:Empleado = new Empleado();
    private licencias:Licencia[]=[];
    private periodoEmpleadoLicencia:PeriodoEmpleado = new PeriodoEmpleado();
    private periodosEmpleados:PeriodoEmpleado[]=[];
    private tiempoTrabajado:string;
    private idPeriodoEmpleadoLicencia:number;
    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    public dataItemLicencia: Licencia;
    private gridViewLicencias: GridDataResult;
    private pageSizeLicencias: number = 10;
    private skipLicencias: number = 0;
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();

    constructor(private empleadoService:EmpleadoService,
                public backendService: BackendService,
                private _router: Router,
                private licenciaService:LicenciaService) {
        super(backendService,'AU001');
    }

    ngOnInit() {
        let idEmpleado = this.currentUser.idEmpleado;
        this.cargarInformacion(idEmpleado);
    }

    cargarInformacion(idEmpleado:number){
        this.cargarinformacionEmpelado(idEmpleado);
        this.periodoEmpleadoLicencia.idEmpleado = idEmpleado;
        this.cargarLicencias(this.periodoEmpleadoLicencia);
    }

    cargarinformacionEmpelado(idEmpleado:number){
        this.verEmpleado(idEmpleado);
    }

    verEmpleado(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.obtenerEmpleado(idEmpleado).subscribe(
            data => {
                this.cargarEmpleado(data);
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }

    cargarLicencias(periodoEmpleado: PeriodoEmpleado){
        this.showLoading = true;
        this.licenciaService.verLicencias(periodoEmpleado).subscribe(
            data => {
                    this.licencias = data;
                    this.obtenerGridLicencias();
                    this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
    }

    onChangeLicenciaPorPeriodo(value){
        this.periodoEmpleadoLicencia.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleadoLicencia.idPeriodoEmpleado = value;
        this.cargarLicencias(this.periodoEmpleadoLicencia);
    }

    cargarEmpleado(data:Empleado){
        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;
        if(data.fotoPerfil != null) {
            this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
            $('#iconPerson').prop("class","");
        }

        this.empleado = data;
    }

    onEditarLicencias(dataItem: any): void {
        this.storeSessionFilter.isNew = false;
        this.storeSessionFilter.idTableFilter = dataItem.idLicencia;
        this.empleadoService.storeSessionStorage('editarConsultaLicencia',this.storeSessionFilter);
        this._router.navigate(['/autogestion/editarConsultaLicencia']);
    }

    @ViewChild(LicenciaDialogFormComponent) protected editLicenciaFormComponent: LicenciaDialogFormComponent;

    public onViewLicencias(dataItem: any): void {

        this.editLicenciaFormComponent.tituloCabecera = "Editar";
        this.editLicenciaFormComponent.obtenerTipoLicencia();
        this.dataItemLicencia = dataItem;

        if(this.dataItemLicencia.estado == 'P'){
            this.editLicenciaFormComponent.isEnviado=false;
            this.editLicenciaFormComponent.enviadoClass='input';
        }else {
            this.editLicenciaFormComponent.isEnviado=true;
            this.editLicenciaFormComponent.enviadoClass='input state-disabled';
        }

        this.editLicenciaFormComponent.periodo = this.dataItemLicencia.periodo;
        this.editLicenciaFormComponent.jefeInmediato = this.dataItemLicencia.jefeInmediato;
        this.editLicenciaFormComponent.idTipoLicencia = this.dataItemLicencia.idTipoLicencia;
        this.editLicenciaFormComponent.nombreTipoLicencia = this.dataItemLicencia.nombreTipoLicencia;
        this.editLicenciaFormComponent.comentario = this.dataItemLicencia.comentario;
        this.editLicenciaFormComponent.fechaInicio = this.dataItemLicencia.fechaInicio;
        this.editLicenciaFormComponent.fechaFin = this.dataItemLicencia.fechaFin;
        this.editLicenciaFormComponent.dias = this.dataItemLicencia.dias;
        this.editLicenciaFormComponent.diaEntero = this.dataItemLicencia.diaEntero;
        this.editLicenciaFormComponent.horaInicio = this.dataItemLicencia.horaInicio;

        this.editLicenciaFormComponent.horaFin = this.dataItemLicencia.horaFin;

        this.editLicenciaFormComponent.isCheckedTodoDia = this.dataItemLicencia.diaEntero;

        this.editLicenciaFormComponent.documentos = this.dataItemLicencia.documentos;

    }

    public onCancelarLicencias(): void {
        this.dataItemLicencia = undefined;
    }

    public onAgregarLicencias(dto: Licencia): void {
        this.cargarLicencias(this.periodoEmpleadoLicencia);

    }

    public onEliminarLicencias(e: Licencia): void {
        this.showLoading = true;
        this.empleadoService.eliminarLicenciaEmpleado(e.idLicencia).subscribe(

            (data:NotificacionResult) => {

                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.cargarLicencias(this.periodoEmpleadoLicencia);
                }
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    public editarLicencias(data: Licencia): Observable<Licencia[]> {
        return this.fetchLicencias("update", data);
    }

    public eliminarLicencias(data: Licencia): Observable<Licencia[]> {
        return this.fetchLicencias("destroy", data);
    }

    private fetchLicencias(action: string = "", data?: Licencia): Observable<Licencia[]>  {

        if(action=="update"){
            var indice = this.licencias.indexOf(data);
            if(indice>=0)
                this.licencias[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.licencias.indexOf(data);

            if(indice>=0)
                this.licencias.splice(indice, 1);

        }

        return Observable.of(this.licencias);
    }

    obtenerGridLicencias():void{
        if(this.licencias.length>0){
            this.gridViewLicencias = {
                data: this.licencias.slice(this.skipLicencias, this.skipLicencias + this.pageSizeLicencias),
                total: this.licencias.length
            };
        }else{
            this.gridViewLicencias = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeLicencias(event: PageChangeEvent): void {
        this.skipLicencias = event.skip;
        this.obtenerGridLicencias();

    }

    solicitarLicencia(){
        this._router.navigate(['/autogestion/solicitarLicencia']);
    }

}
