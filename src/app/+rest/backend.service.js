"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var rxjs_1 = require("rxjs");
var backend_model_1 = require("./backend.model");
var angular2_jwt_1 = require("angular2-jwt");
var BackendService = (function () {
    //msgs: Message[] = [];
    function BackendService(host, http, authHttp, router) {
        this.host = host;
        this.http = http;
        this.authHttp = authHttp;
        this.router = router;
    }
    BackendService.prototype.constructUrl = function (urlOptions) {
        return this.host + urlOptions.restOfUrl;
    };
    //T specifies a generic output of function
    BackendService.prototype.Request = function (requestType, urlOptions, body, options) {
        var response;
        //True in case of post, put and patch
        if (body && options) {
            response = this.http[backend_model_1.RequestTypes[requestType]](this.constructUrl(urlOptions), body, options);
        }
        else if (body) {
            var header = new http_1.Headers({ 'Content-Type': 'application/json' });
            response = this.http[backend_model_1.RequestTypes[requestType]](this.constructUrl(urlOptions), body, { headers: header });
        }
        else if (options) {
            response = this.http[backend_model_1.RequestTypes[requestType]](this.constructUrl(urlOptions), options);
        }
        else {
            response = this.http[backend_model_1.RequestTypes[requestType]](this.constructUrl(urlOptions), options);
        }
        return response.map(function (res) { return res.json(); });
    };
    //T specifies a generic output of function
    BackendService.prototype.AuthRequest = function (requestType, urlOptions, body, options) {
        var response;
        //True in case of post, put and patch
        if (body && options) {
            response = this.authHttp[backend_model_1.RequestTypes[requestType]](this.constructUrl(urlOptions), body, options);
        }
        else if (body) {
            var header = new http_1.Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
            response = this.authHttp[backend_model_1.RequestTypes[requestType]](this.constructUrl(urlOptions), body, { headers: header });
        }
        else if (options) {
            response = this.authHttp[backend_model_1.RequestTypes[requestType]](this.constructUrl(urlOptions), options);
        }
        else {
            response = this.authHttp[backend_model_1.RequestTypes[requestType]](this.constructUrl(urlOptions), options);
        }
        return response.map(function (res) { return res.json(); });
    };
    /*public notification(msgs:Message[],  error: any){
        this.msgs = msgs;
        this.msgs.push({severity: error.severity, summary: error.summary, detail:error.detail});
    }*/
    BackendService.prototype.handleError = function (error) {
        if (error instanceof angular2_jwt_1.AuthHttpError) {
            this.router.navigate(['/noautorizado']);
            return rxjs_1.Observable.throw(error);
        }
        console.error('An error occurred', error);
        return rxjs_1.Observable.throw(error.json().error || 'Server error');
    };
    return BackendService;
}());
BackendService = __decorate([
    core_1.Injectable()
], BackendService);
exports.BackendService = BackendService;
