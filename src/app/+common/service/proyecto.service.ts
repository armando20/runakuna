import {Injectable} from "@angular/core";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Proyecto} from "../../+dto/maintenance/proyecto";
import {ProyectoFilter} from "../../+dto/proyectoFilter";
import {ProyectoResult} from "../../+dto/proyectoResult";
import {ProyectoQuickFilter} from "../../+dto/proyectoQuickFilter";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";

@Injectable() 
export class ProyectoService {

  private busquedaUrl = '/api/proyecto/obtenerProyectos';
  private busquedaDetalleUrl = '/api/proyecto/obtenerProyectoDetalle';
  private busquedaRapidaUrl = '/api/proyecto/busquedaRapidaProyectos';
  private registrarUrl = '/api/proyecto/registrarProyecto';
  private eliminarUrl = '/api/proyecto/eliminarProyecto';

  constructor(private backendService: BackendService) {
  }

  registrarProyecto(proyecto: Proyecto){

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.registrarUrl;
    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(proyecto))
        .map(res => <NotificacionResult> res)
        .catch(err=> this.backendService.handleError(err));
  }

  verProyecto(idProyecto: number) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaDetalleUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idProyecto))
        .map(res => <Proyecto> res)
        .catch(err=> this.backendService.handleError(err));

  }

  buscarProyectos(busquedaProyectos: ProyectoFilter) {

     let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,busquedaProyectos)
        .map(res => <ProyectoResult[]> res)
        .catch(err=> this.backendService.handleError(err));
  }

  busquedaRapidaProyecto(quickFilter: ProyectoQuickFilter) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaRapidaUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,quickFilter)
        .map(res => <ProyectoResult[]> res)
        .catch(err=> this.backendService.handleError(err));
  }

  eliminarProyecto(idProyecto: number) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.eliminarUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idProyecto))
        .map(res => <NotificacionResult> res)
        .catch(err=> this.backendService.handleError(err));

  }

}