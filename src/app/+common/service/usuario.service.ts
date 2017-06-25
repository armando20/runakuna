/**
 * Created by javier.cuicapuza on 1/18/2017.
 */
import {Injectable} from "@angular/core";
import {UsuarioFilter} from "../../+dto/usuarioFilter";
import {UsuarioResult} from "../../+dto/usuarioResult";
import {Usuario} from "../../+dto/maintenance/usuario";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {UsuarioQuickFilter} from "../../+dto/usuarioQuickFilter";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {Rol2} from "../../+dto/maintenance/rol2";
import {UsuarioViewModelAutoComplete} from "../../+dto/usuarioViewModelAutoComplete";

@Injectable()
export class UsuarioService {

    private busquedaUrl = '/auth/obtenerUsuarios';
    private busquedaRapidaUrl = '/auth/busquedaRapidaUsuarios';
    private busquedaDetalleUrl = '/auth/obtenerUsuarioDetalle';
    private getInfoAutoCompleteEmpleadoUrl = '/auth/getInfoAutoCompleteEmpleado';
    private registrarUrl = '/auth/registrarUsuario';
    private eliminarUrl = '/auth/eliminarUsuario';
    private comboRol='/auth/cargarComboRol';

    constructor(private backendService: BackendService) {
    }

    buscarUsuarioEmpleado(busquedaRol: UsuarioFilter){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(busquedaRol))
            .map(res => <UsuarioResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    busquedaRapidaUsuarios(quickFilter: UsuarioQuickFilter){

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaRapidaUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
            .map(res => <UsuarioResult[]> res)
            .catch(err=> this.backendService.handleError(err));
    }

    obtenerUsuarioById(idUsuario: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.busquedaDetalleUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(idUsuario))
            .map(res => <Usuario> res)
            .catch(err=> this.backendService.handleError(err));

    }

    getInfoAutoCompleteEmpleado(idEmpleado: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.getInfoAutoCompleteEmpleadoUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(idEmpleado))
            .map(res => <UsuarioViewModelAutoComplete> res)
            .catch(err=> this.backendService.handleError(err));

    }

    guardarUsuario(usuario: Usuario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.registrarUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(usuario))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    eliminarUsuarioEmpleado(usuario: any) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.eliminarUrl;

        return this.backendService.Request(RequestTypes.post, urlOptions,JSON.stringify(usuario))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));

    }

    cargarComboRol() {
        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = this.comboRol;

        return this.backendService.Request(RequestTypes.get, urlOptions, null)
            .map(res => <Rol2[]> res)
            .catch(err => this.backendService.handleError(err));

    }

}