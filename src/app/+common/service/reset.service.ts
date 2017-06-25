import {Injectable} from "@angular/core";
import "rxjs/Rx";

import {environment} from "../../../environments/environment";
import {Usuario} from "../../+dto/maintenance/usuario";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {BackendService} from "../../+rest/backend.service";
import {IUrlOptions, RequestTypes} from "../../+rest/backend.model";

@Injectable()
export class ResetService {

    constructor(private backendService: BackendService) {
    }

    sendMailPasswordRecovery(usuario: Usuario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/reset/forgotPassword';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(usuario))
            .map(res => <Usuario> res)
            .catch(err=> this.backendService.handleError(err));
    }

    validateLinkResetPassword(usuario: Usuario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/reset/validateLink';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(usuario))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }

    resetPassword(usuario: Usuario) {

        let urlOptions: IUrlOptions = <IUrlOptions>{};
        urlOptions.restOfUrl = '/reset/resetPassword';
        return this.backendService.AuthRequest(RequestTypes.post, urlOptions,JSON.stringify(usuario))
            .map(res => <NotificacionResult> res)
            .catch(err=> this.backendService.handleError(err));
    }
}