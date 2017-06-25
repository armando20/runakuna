import {Injectable} from "@angular/core";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {Proyecto} from "../../+dto/maintenance/proyecto";
import {ProyectoFilter} from "../../+dto/proyectoFilter";
import {ProyectoResult} from "../../+dto/proyectoResult";
import {ProyectoQuickFilter} from "../../+dto/proyectoQuickFilter";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {RendimientoFilter} from "../../+dto/rendimientoFilter";
import {MarcacionesMensualesResult} from "../../+dto/marcacionesMensualesResult";

@Injectable() 
export class EstadisticaService {

  private busquedaUrl = '/api/estadistica/obtenerMarcacionesMensuales';


  constructor(private backendService: BackendService) {
  }

  obtenerMarcacionesMensuales(busquedaMarcacionesMensuales: RendimientoFilter) {

     let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,busquedaMarcacionesMensuales)
        .map(res => <MarcacionesMensualesResult[]> res)
        .catch(err=> this.backendService.handleError(err));
  }



}