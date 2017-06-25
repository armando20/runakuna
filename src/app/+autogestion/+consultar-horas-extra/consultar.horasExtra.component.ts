import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisService} from "../../+common/service/pais.service";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {ComponentBase} from "../../+common/service/componentBase";
import {VacacionService} from "../../+common/service/vacacion.service";
import {HorasExtra} from "../../+dto/maintenance/horasExtra";
import {HorasExtrasDialogFormComponent} from "./horasExtras.dialog.component";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {LicenciaService} from "../../+common/service/licencia.service";
import {BackendService} from "../../+rest/backend.service";
import {Router} from "@angular/router";

declare var $: any;

var moment = require('moment');

@Component({
    selector: 'sa-consultar-horasExtra',
    templateUrl: 'consultar.horasExtra.component.html',
    providers: [PaisService,VacacionService,HorasExtraService,LicenciaService],
})
export class ConsultarHorasExtraComponent extends ComponentBase implements OnInit {

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
    public defaultItemPeriodo={idPeriodoEmpleado:null,periodo:'Todos'};
    private empleado:Empleado = new Empleado();
    private horasExtras:HorasExtra[]=[];
    private periodoEmpleadoHorasExtra:PeriodoEmpleado = new PeriodoEmpleado();
    private periodosEmpleados:PeriodoEmpleado[]=[];
    private idPeriodoEmpleadoHorasExtra:number;
    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';

    constructor(private empleadoService:EmpleadoService,
                public backendService: BackendService,
                private _router: Router,
                private horasExtraService:HorasExtraService) {

        super(backendService,'AU001');

    }

    ngOnInit() {
        let idEmpleado = this.currentUser.idEmpleado;
        this.cargarInformacion(idEmpleado);
    }

    cargarInformacion(idEmpleado:number){
        this.cargarinformacionEmpelado(idEmpleado);
        this.periodoEmpleadoHorasExtra.idEmpleado = idEmpleado;
        this.cargarHorasExtras(this.periodoEmpleadoHorasExtra);
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

    cargarHorasExtras(periodoEmpleado: PeriodoEmpleado){
        this.showLoading = true;
        this.horasExtraService.verHorasExtras(periodoEmpleado).subscribe(
            data => {this.horasExtras = data;
                this.obtenerGridHorasExtras();
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
    }

    onChangeHorasExtrasPorPeriodo(value){
        this.periodoEmpleadoHorasExtra.idEmpleado = this.empleado.idEmpleado;
        this.periodoEmpleadoHorasExtra.idPeriodoEmpleado = value;
        this.cargarHorasExtras(this.periodoEmpleadoHorasExtra);
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

    public dataItemHoraExtra: HorasExtra;

    private gridViewHorasExtras: GridDataResult;

    private pageSizeHorasExtras: number = 10;
    private skipHorasExtras: number = 0;

    @ViewChild(HorasExtrasDialogFormComponent) protected editHorasExtrasFormComponent: HorasExtrasDialogFormComponent;

    public onEditarhorasExtras(dataItem: any): void {

        this.editHorasExtrasFormComponent.tituloCabecera = "Editar";

        this.dataItemHoraExtra = dataItem;

        if(this.dataItemHoraExtra.estado == 'P'){
            this.editHorasExtrasFormComponent.isEnviado=false;
            this.editHorasExtrasFormComponent.enviadoClass='input';
        }else {
            this.editHorasExtrasFormComponent.isEnviado=true;
            this.editHorasExtrasFormComponent.enviadoClass='input state-disabled';
        }

        this.editHorasExtrasFormComponent.fecha = this.dataItemHoraExtra.fecha;
        this.editHorasExtrasFormComponent.jefeInmediato = this.dataItemHoraExtra.jefeInmediato;
        this.editHorasExtrasFormComponent.horaSalidaHorario = this.dataItemHoraExtra.horaSalidaHorario;
        this.editHorasExtrasFormComponent.horaSalidaSolicitado = this.dataItemHoraExtra.horaSalidaSolicitado;
        this.editHorasExtrasFormComponent.horas = this.dataItemHoraExtra.horas;
        this.editHorasExtrasFormComponent.motivo = this.dataItemHoraExtra.motivo;
        this.editHorasExtrasFormComponent.horasCompensadas = this.dataItemHoraExtra.horasCompensadas;
        this.editHorasExtrasFormComponent.horasSemanalesPendientes = this.dataItemHoraExtra.horasSemanalesPendientes;

        this.editHorasExtrasFormComponent.comentarioResolucion = this.dataItemHoraExtra.comentarioResolucion;
        this.editHorasExtrasFormComponent.horasNoCompensables = this.dataItemHoraExtra.horasNoCompensables;
        this.editHorasExtrasFormComponent.horasAdicionales = this.dataItemHoraExtra.horasNoCompensables + parseFloat(this.dataItemHoraExtra.horas.toString());
        this.editHorasExtrasFormComponent.estado = this.dataItemHoraExtra.estado;
        this.editHorasExtrasFormComponent.nombreEstado = this.dataItemHoraExtra.nombreEstado;

    }


    public onCancelarHorasExtras(): void {
        this.dataItemHoraExtra = undefined;
    }

    public onAgregarHorasExtras(dto: HorasExtra): void {

        this.editarHorasExtras(dto);
        this.obtenerGridHorasExtras();

    }

    public onEliminarHorasExtras(e: HorasExtra): void {
        const operation = this.eliminarHorasExtras(e);
        this.obtenerGridHorasExtras();
    }


    public editarHorasExtras(data: HorasExtra): Observable<HorasExtra[]> {
        return this.fetchHorasExtras("update", data);
    }


    public eliminarHorasExtras(data: HorasExtra): Observable<HorasExtra[]> {
        return this.fetchHorasExtras("destroy", data);
    }

    private fetchHorasExtras(action: string = "", data?: HorasExtra): Observable<HorasExtra[]>  {

        if(action=="update"){
            var indice = this.horasExtras.indexOf(data);
            if(indice>=0)
                this.horasExtras[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.horasExtras.indexOf(data);

            if(indice>=0)
                this.horasExtras.splice(indice, 1);

        }

        return Observable.of(this.horasExtras);
    }

    obtenerGridHorasExtras():void{
        if(this.horasExtras.length>0){
            this.gridViewHorasExtras = {
                data: this.horasExtras.slice(this.skipHorasExtras, this.skipHorasExtras + this.pageSizeHorasExtras),
                total: this.horasExtras.length
            };
        }else{
            this.gridViewHorasExtras = {
                data: [],
                total: 0
            };
        }
    }

    protected pageChangeHorasExtras(event: PageChangeEvent): void {
        this.skipHorasExtras = event.skip;
        this.obtenerGridHorasExtras();

    }

    solicitarHorasExtra(){
        this._router.navigate(['/autogestion/solicitarHorasExtra']);
    }

}
