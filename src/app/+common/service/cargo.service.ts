import {Injectable} from "@angular/core";
import "rxjs/Rx";
import {Cargo} from "../../+dto/maintenance/cargo";

import {Horario} from "../../+dto/maintenance/horario";
import {HistorialLaboral} from "../../+dto/maintenance/historialLaboral";
import "rxjs/add/operator/toPromise";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {CargoFilter} from "../../+dto/cargoFilter";
import {CargoQuickFilter} from "../../+dto/cargoQuickFilter";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";
import {BackendService} from "../../+rest/backend.service";
import {CargoResult} from "../../+dto/cargoResult";
import {Dias} from "../../+personal/+nuevo-cargo/dias";
import {ProyectoFilter} from "../../+dto/proyectoFilter";
import {CargoCombo} from "../../+dto/cargoCombo";


@Injectable() 
export class CargoService {

  private busquedaUrl = '/api/cargo/obtenerCargos';
  private busquedaDetalleUrl = '/api/cargo/obtenerCargoDetalle';
  private busquedaCargoComboHistorialLaboralUrl = '/api/cargo/obtenerCargoComboHistorialLaboral';

  private busquedaRapidaUrl = '/api/cargo/busquedaRapidaCargos';

  constructor(private backendService: BackendService) { }


  registrarCargo(historialLaboral: HistorialLaboral){

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = '/api/cargo/crearCargo';
    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,historialLaboral).map(res => <NotificacionResult> res)
        .catch(err=> this.backendService.handleError(err));

  }
  
  completarFilaDia(){

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = '/api/tablaGeneral/obtenerDias';
    return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <Dias[]> res)
        .catch(err=> this.backendService.handleError(err));

  }

  cargarComboHorario() {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = '/api/cargo/nombreHorario';
    return this.backendService.AuthRequest(RequestTypes.get, urlOptions).map(res => <Horario[]> res)
        .catch(err=> this.backendService.handleError(err));
  }


  obtenerCargo(idCargo: number) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaDetalleUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(idCargo))
        .map(res => <Cargo> res)
        .catch(err=> this.backendService.handleError(err));

  }

  buscarCargos(busquedaCargos: CargoFilter) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(busquedaCargos))
        .map(res => <CargoResult[]> res)
        .catch(err=> this.backendService.handleError(err));
  }

  buquedaRapidaCargos(quickFilter: CargoQuickFilter) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaRapidaUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(quickFilter))
        .map(res => <CargoResult[]> res)
        .catch(err=> this.backendService.handleError(err));
  }

  obtenerCargoComboHistorialLaboral(proyecto: ProyectoFilter) {

    let urlOptions: IUrlOptions = <IUrlOptions>{};
    urlOptions.restOfUrl = this.busquedaCargoComboHistorialLaboralUrl;

    return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(proyecto))
        .map(res => <CargoCombo> res)
        .catch(err=> this.backendService.handleError(err));

  }

}