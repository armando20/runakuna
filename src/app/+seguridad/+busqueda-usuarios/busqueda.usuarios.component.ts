import {Component, OnInit, ViewChild} from "@angular/core";


import {CompleterData, CompleterService} from "ng2-completer";
import {BackendService} from "../../+rest/backend.service";
import {ComponentBase} from "app/+common/service/componentBase";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Router} from "@angular/router";
import {UsuarioService} from "../../+common/service/usuario.service";
import {Usuario} from "../../+dto/maintenance/usuario";
import {ConfirmDialogComponent} from "../../shared/confirm/confirmDialogBase";
import {orderBy, SortDescriptor} from "@progress/kendo-data-query";
import {UsuarioQuickFilter} from "../../+dto/usuarioQuickFilter";
import {GridDataResult} from "@progress/kendo-angular-grid";
import {UsuarioResult} from "../../+dto/usuarioResult";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {UsuarioFilter} from "../../+dto/usuarioFilter";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";

/**
 * Created by josediaz on 6/25/17.
 */






@Component({
    selector: 'busqueda-usuarios',
    templateUrl: 'busqueda.usuarios.component.html'
})
export class BusquedaUsuariosComponent extends ComponentBase implements OnInit {

    public estados:TablaGeneralResult[];
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Todos', grupo:null};
    public estadosSelect: TablaGeneralResult;
    private dataServiceEmpleado:CompleterData;

    private usuarioFilter: UsuarioFilter = new UsuarioFilter();
    storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    usuarioResult: UsuarioResult[] = [];
    private gridView: GridDataResult;
    private pageSize: number = 10;
    private skip: number = 0;
    public isSearch: boolean = false;

    quickFilter:UsuarioQuickFilter = new UsuarioQuickFilter();
    private sort: SortDescriptor[] = [];


    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                private usuarioService: UsuarioService,
                public backendService: BackendService,
                private completerService: CompleterService){
        super(backendService,'SE001');
    }

    ngOnInit(): void {

        this.dataServiceEmpleado =
            this.completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

    }


    @ViewChild(ConfirmDialogComponent) private confirmDialogComponent: ConfirmDialogComponent;

    public confirm(dataItem:Usuario): void {
        this.confirmDialogComponent.titulo="Eliminar Usuario"
        this.confirmDialogComponent.dataItem=dataItem;
        this.confirmDialogComponent.onShow();

    }

    /* metodos de la pantalla */


    onQuickSearck(){
        this.busquedaRapidaUsuarios();
    }

    private busquedaRapidaUsuarios(){
        this.showLoading=true;
        this.usuarioService.busquedaRapidaUsuarios(this.quickFilter).subscribe(
            data => {
                this.isSearch = true;
                this.usuarioResult = data;
                this.skip = 0;
                this.obtenerUsuarios();
                this.showLoading=false;
            },
            error => {
                this.showLoading=false;
                this.backendService.handleError(error);
            }
        );
    }

    private obtenerUsuarios(): void {

        if(this.usuarioResult.length>0){
            this.gridView = {
                data: orderBy(this.usuarioResult,this.sort).slice(this.skip, this.skip + this.pageSize),
                total: this.usuarioResult.length
            };
        }else{
            this.gridView = {
                data: [],
                total: 0
            };
        }
    }

}