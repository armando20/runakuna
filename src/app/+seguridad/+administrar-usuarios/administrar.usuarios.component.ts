/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
import {Component, OnInit, EventEmitter,Output} from '@angular/core';
import { Location } from '@angular/common';
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {CompleterData, CompleterService} from "ng2-completer";
import {Observable} from "rxjs";
import {StoreSessionFilter} from "../../+dto/storeSessionFilter";
import {Usuario} from "../../+dto/maintenance/usuario";
import {UsuarioRol} from "../../+dto/maintenance/usuarioRol";
import {UsuarioService} from "../../+common/service/usuario.service";
import {RolResult} from "../../+dto/rolResult";
import {ComponentBase} from "../../+common/service/componentBase";
import {Rol2} from "../../+dto/maintenance/rol2";
import {BackendService} from "../../+rest/backend.service";
import {UsuarioViewModelAutoComplete} from "../../+dto/usuarioViewModelAutoComplete";

declare var $: any;

@Component({
    selector: 'administrar-alertas',
    templateUrl: 'administrar.usuarios.component.html'
})
export class AdministrarUsuariosComponent extends ComponentBase implements OnInit {

    @Output() save: EventEmitter<any> = new EventEmitter();
    public estados: TablaGeneralResult[];
    public estadosSelect: TablaGeneralResult;
    public defaultItemEstados: TablaGeneralResult = {codigo: null, nombre: 'Seleccionar', grupo: null};
    private dataServiceEmpleado: CompleterData;
    private storeSessionFilter: StoreSessionFilter = new StoreSessionFilter();
    usuario: Usuario = new Usuario();
    usuarioViewModelAutoComplete: UsuarioViewModelAutoComplete = new UsuarioViewModelAutoComplete();
    usuarioRol: UsuarioRol = new UsuarioRol();

    public counter : number = 0;

    private view: Array<Rol2>=[];
    private allRol: Rol2[];
    private rolSelect: Rol2 = new Rol2();

    public defaultItemAllRoles: RolResult = {idRol: null, descripcion: 'Seleccionar', nombre: null, estado: null, rolSistema:null};
    public asociadoEmpleado: boolean = true;
    public isEditCodEmpleado: boolean = false;
    public showAutocomplete: boolean = false;
    public checkAsociadoEmpleado: boolean = true;

    constructor(public backendService: BackendService,
                private empleadoService: EmpleadoService,
                private usuarioService: UsuarioService,
                private completerService: CompleterService,
                private location: Location) {
        super(backendService,'SE001');

    }

    ngOnInit() {
        this.dataServiceEmpleado = this.completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

        this.storeSessionFilter = this.empleadoService.retrieveSessionStorage('editUsuarioResult');
        if(this.storeSessionFilter.isNew == false){
            this.obtenerUsuarioById(this.storeSessionFilter.idTableFilter);
        }else{
            this.usuario = new Usuario();
            this.usuario.estado = 'A';
            this.getEstados();
        }
        this.cargarComboRoles();
    }

    private obtenerUsuarioById(idUsuario: any): void{
        this.showLoading = true;
        this.usuarioService.obtenerUsuarioById(idUsuario).subscribe(
            data => {
                this.showDetail(data);
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            }
        );
    }

    onRegresarBusquedaUsuarios(){
        this.location.back();
    }

    private onGuardarUsuarios(){
        if(this.validarRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        if(this.validarRolRequerido()){
            this.msgs.push({severity: 'warn', summary: '', detail:'A&ntilde;adir un rol.'});
            return;
        }

        this.usuario.usuarioRol = this.view;
        if(this.checkAsociadoEmpleado == false){
            this.usuario.idEmpleado = null;
        }

        this.usuario.idEmpresa = this.currentUser.idEmpresa;

        this.showLoading=true;
        this.usuarioService.guardarUsuario(this.usuario).subscribe(
            data => {
                this.backendService.notification(this.msgs, data);
                if (data.codigo == 1) {
                    setTimeout(() => {
                        this.navegarBusquedaUsuario(data);
                    }, 2000);
                }
                this.showLoading=false;
            },
            error => {
                this.showLoading=false;
                this.backendService.notification(this.msgs, error);
            }


        );
    }
    showDetail(data:Usuario){
        this.usuario = data;
        this.view = data.usuarioRol;
        this.isEditCodEmpleado = true;
        if(this.usuario.idEmpleado== null){
            this.showAutocomplete = true;
        }
        this.getEstados();
    }

    navegarBusquedaUsuario(data:NotificacionResult){
        this.goBack();
    }
    private validarRequerido():boolean{

        let validacion = false;
        if(this.usuario.cuentaUsuario=== undefined || this.usuario.cuentaUsuario == null){
            $('#cuentaUsuario').addClass('invalid').removeClass('required');
            $('#cuentaUsuario').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.nombre=== undefined || this.usuario.nombre == null){
            $('#nombre').addClass('invalid').removeClass('required');
            $('#nombre').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.apellidoPaterno=== undefined || this.usuario.apellidoPaterno == null){
            $('#apellidoPaterno').addClass('invalid').removeClass('required');
            $('#apellidoPaterno').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.apellidoMaterno=== undefined || this.usuario.apellidoMaterno == null){
            $('#apellidoMaterno').addClass('invalid').removeClass('required');
            $('#apellidoMaterno').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }
        if(this.usuario.estado=== undefined || this.usuario.estado == null || this.estados === undefined || this.estados == null){
            $('#estado').addClass('invalid').removeClass('required');
            $('#estado').parent().addClass('state-error').removeClass('state-success');
            $('#estado').css('border','2px solid red');
            validacion = true;
        }

        return validacion;
    }
    private validarRolRequerido():boolean{

        let validacion = false;
        if(this.view === undefined || this.view == null || this.view.length <= 0){
            validacion = true;
        }
        return validacion;
    }
    goBack(): void {
        this.location.back();
    }

    selectEmpleado(e){
        if(e !=null) {
            this.usuario.idEmpleado = e.originalObject.idEmpleado;

            this.usuarioService.getInfoAutoCompleteEmpleado(this.usuario.idEmpleado).subscribe(
                data => {
                    this.showInfoAutoCompleteEmpleado(data);
                },
                error => {
                    this.backendService.notification(this.msgs, error);
                }
            );
        }else {
            this.usuario.idEmpleado = null;
        }
    }

    showInfoAutoCompleteEmpleado(data:Usuario){
        this.usuarioViewModelAutoComplete = data;
        this.usuario.nombre = this.usuarioViewModelAutoComplete.nombre;
        this.usuario.apellidoPaterno = this.usuarioViewModelAutoComplete.apellidoPaterno;
        this.usuario.apellidoMaterno = this.usuarioViewModelAutoComplete.apellidoMaterno;
        this.usuario.email = this.usuarioViewModelAutoComplete.email;
    }

    public changeEstado(value): void {
        let estadoVal: any = value;
        this.usuario.estado = estadoVal;
        $('#estado').css('border','none');

    }

    selectedRol(e){
        this.rolSelect = e;
    }

    onAgregarRol(e){
        e.preventDefault();
        this.save.emit(this.rolSelect);
        if(this.rolSelect.porDefecto == null){
            this.rolSelect.porDefecto = false;
        }
        this.crearRol(this.rolSelect);
        this.usuarioRol.idRol = undefined;

        if(this.storeSessionFilter.isNew && this.counter == 0 ){
            this.usuarioRol.porDefecto = true;
            this.counter += 1;
        }
    }
    public crearRol(dataV: Rol2): Observable<Rol2[]> {
        return this.fetch("create", dataV);
    }
    public onDelete(e: Rol2): void {
        const operation = this.eliminarRol(e);
    }
    public eliminarRol(data: Rol2): Observable<Rol2[]> {
        return this.fetch("destroy", data);
    }

    private fetch(action: string = "", data?: Rol2): Observable<Rol2[]>  {

        if (action === "create"){
            let rolEnt : Rol2 = (JSON.parse(JSON.stringify(data)));
            this.view.push(rolEnt);
        }else if (action === "update"){
            let indice = this.view.indexOf(data);
            if (indice >= 0)
                this.view[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if (action === "destroy"){

            let indice = this.view.indexOf(data);

            if (indice >= 0)
                this.view.splice(indice, 1);

        }

        return Observable.of(this.view);
    }

    private getEstados() {
        this.estados = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Usuario.Estado' === grupo.grupo);
    }

    private cargarComboRoles(){
        this.showLoading = true;
        this.usuarioService.cargarComboRol().subscribe(
            roles => {
                this.loadComboRoles(roles);
                this.showLoading = false;
            },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs, error);
            });
    }

    private loadComboRoles(data: Rol2[]){
        this.allRol = data;
    }

    public isCheckAsociadoEmpleado(value){
        let isChecked:boolean = value.target.checked;
        this.checkAsociadoEmpleado = isChecked;
    }
}