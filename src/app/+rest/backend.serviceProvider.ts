import { Http } from '@angular/http';
import {BackendService} from "./backend.service";
import {AuthHttp} from "angular2-jwt";
import {Router} from "@angular/router";
export function provideBackendService() {
    let localhost:  String = 'localhost';
    let port: String = '7999';
    let url = "http://" + localhost + ":" + port;
    return {
        provide: BackendService, useFactory: (http, authHttp, router) => {
            return new BackendService(url, http , authHttp, router);
        },
        deps: [Http, AuthHttp, Router]
    }
}
