import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisService} from "../../+common/service/pais.service";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {Vacacion} from "../../+dto/maintenance/vacacion";
import {ComponentBase} from "../../+common/service/componentBase";
import {VacacionService} from "../../+common/service/vacacion.service";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {LicenciaService} from "../../+common/service/licencia.service";
import {BackendService} from "../../+rest/backend.service";
import {VacacionesDialogFormComponent} from "./vacaciones.dialog.component";
import {Router} from "@angular/router";
import {NotificacionResult} from "../../+dto/notificacionResult";

declare var $: any;

var moment = require('moment');

@Component({
    selector: 'sa-consultar-vacaciones',
    templateUrl: 'consultar.vacaciones.component.html',
    providers: [PaisService,VacacionService,HorasExtraService,LicenciaService],
})
export class ConsultarVacacionesComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
    public defaultItemPeriodo={idPeriodoEmpleado:null,periodo:'Todos'};
    private empleado:Empleado = new Empleado();
    private vacaciones:Vacacion[]=[];
    private periodoEmpleadoVacaciones:PeriodoEmpleado = new PeriodoEmpleado();
    private periodosEmpleados:PeriodoEmpleado[]=[];
    private idPeriodoEmpleadoVacaciones:number;
    private diasDisponibles:number;
    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    constructor(private empleadoService:EmpleadoService,
                public backendService: BackendService,
                private vacacionService: VacacionService,
                private _router: Router) {

        super(backendService,'AU001');
    }

    ngOnInit() {
        this.showLoading = true;
        let idEmpleado = this.currentUser.idEmpleado;
        this.cargarInformacion(idEmpleado);
    }


    cargarInformacion(idEmpleado:number){
        this.cargarinformacionEmpelado(idEmpleado);
        this.verPeriodoEmpleado(idEmpleado);
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

    verPeriodoEmpleado(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.verPeriodoEmpleado(idEmpleado).subscribe(
            data => {
                this.periodosEmpleados = data;

                if(this.periodosEmpleados != null && this.periodosEmpleados.length>0){
                    let periodoEmpleado: PeriodoEmpleado = new PeriodoEmpleado();
                    periodoEmpleado.idEmpleado = idEmpleado;
                    this.diasDisponibles = this.periodosEmpleados[0].diasVacacionesAcumulado;
                    this.cargarVacaciones(periodoEmpleado);
                }
                this.showLoading = false;

            },
            error => {
                    this.showLoading = false;
                    this.backendService.handleError(error);
                }
        );
    }

    cargarVacaciones(periodoEmpleado: PeriodoEmpleado){
        this.showLoading = true;
        this.vacacionService.verVacaciones(periodoEmpleado).subscribe(
            data => {this.vacaciones = data;
                this.obtenerGridVacaciones();
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
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

    public dataItemVacacion: Vacacion;

    private gridViewVacaciones: GridDataResult;

    private pageSizeVacaciones: number = 10;
    private skipVacaciones: number = 0;

    @ViewChild(VacacionesDialogFormComponent) protected editVacacionesFormComponent: VacacionesDialogFormComponent;

    public onEditarVacaciones(dataItem: any): void {

        this.editVacacionesFormComponent.tituloCabecera = "Editar";

        this.dataItemVacacion = dataItem;

        if(this.dataItemVacacion.estado == 'P'){
            this.editVacacionesFormComponent.isEnviado=false;
            this.editVacacionesFormComponent.enviadoClass='input';
        }else {
            this.editVacacionesFormComponent.isEnviado=true;
            this.editVacacionesFormComponent.enviadoClass='input state-disabled';
        }


        this.editVacacionesFormComponent.periodo = this.dataItemVacacion.periodo;
        this.editVacacionesFormComponent.jefeInmediato = this.dataItemVacacion.jefeInmediato;
        this.editVacacionesFormComponent.fechaDesde = this.dataItemVacacion.fechaInicio;
        this.editVacacionesFormComponent.fechaHasta = this.dataItemVacacion.fechaFin;
        this.editVacacionesFormComponent.diasCalendarios = this.dataItemVacacion.diasCalendarios;
        this.editVacacionesFormComponent.diasHabiles = this.dataItemVacacion.diasHabiles;
        this.editVacacionesFormComponent.jefeInmediato = this.dataItemVacacion.jefeInmediato;
        this.editVacacionesFormComponent.periodo = this.dataItemVacacion.periodo;
        this.editVacacionesFormComponent.estado = this.dataItemVacacion.estado;
        this.editVacacionesFormComponent.nombreEstado = this.dataItemVacacion.nombreEstado;
        this.editVacacionesFormComponent.estado = this.dataItemVacacion.estado;
        this.editVacacionesFormComponent.diasVacacionesDisponibles=this.dataItemVacacion.diasVacacionesDisponibles;

    }

    public onCancelarVacaciones(): void {
        this.dataItemVacacion = undefined;
    }

    public onAgregarVacaciones(dto: Vacacion): void {
        this.cargarVacaciones(this.periodoEmpleadoVacaciones);
    }

    public onEliminarVacaciones(e: Vacacion): void {
        this.showLoading = true;
        this.empleadoService.eliminarVacacionEmpleado(e).subscribe(

            (data:NotificacionResult) => {
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.cargarVacaciones(this.periodoEmpleadoVacaciones);
                }
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            }
        );
    }


    public editarVacaciones(data: Vacacion): Observable<Vacacion[]> {
        return this.fetchVacaciones("update", data);
    }

    public eliminarVacaciones(data: Vacacion): Observable<Vacacion[]> {
        return this.fetchVacaciones("destroy", data);
    }

    private fetchVacaciones(action: string = "", data?: Vacacion): Observable<Vacacion[]>  {

        if(action=="update"){
            var indice = this.vacaciones.indexOf(data);
            if(indice>=0)
                this.vacaciones[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.vacaciones.indexOf(data);

            if(indice>=0)
                this.vacaciones.splice(indice, 1);

        }

        return Observable.of(this.vacaciones);
    }

    obtenerGridVacaciones():void{
        if(this.vacaciones.length>0){
            this.gridViewVacaciones = {
                data: this.vacaciones.slice(this.skipVacaciones, this.skipVacaciones + this.pageSizeVacaciones),
                total: this.vacaciones.length
            };
        }else{
            this.gridViewVacaciones = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeVacaciones(event: PageChangeEvent): void {
        this.skipVacaciones = event.skip;
        this.obtenerGridVacaciones();

    }

    programarVacaciones(){
        this._router.navigate(['/autogestion/agendarVacaciones']);
    }

}
