import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "app/+auth/+services/authentication.service";
import {Observable} from "rxjs/Rx";
import {ModuloService} from "../../shared/layout/navigation/http-modulo-service";
import {StorageService} from "../../+common/storageLocalValues/storage.service";
import {AutorizacionFilter} from "../../+dto/autorizacionFilter";
import {AssignedRole} from "../../+dto/assignedRole";
import {Modulo} from "../../+dto/maintenance/modulo";
import {CurrentUser} from "../../+dto/currentUser";
var Rx = require('rxjs/Rx');
declare var $: any;


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    model: any = {};
    loading = false;
    error = '';
    modulos: Array<Modulo>;
    currentUser: CurrentUser;
    private rolAsignado: Array<AssignedRole> = [];
    errorMessage: string;

    authorizationFilter: AutorizacionFilter = new AutorizacionFilter();

    constructor(private router: Router,
                private storageService: StorageService,
                private authenticationService: AuthenticationService,
                private moduloService: ModuloService) {
    }

    ngOnInit() {
        this.resizeWindow();

        $(window).bind("load resize scroll", () => {
            this.resizeWindow();
        });

        $(document).ready(() => {
            this.resizeWindow();
        });
    }

    resizeWindow() {
        $('.content-login').css("height", $(window).height() + "px");
    }

    login() {
        this.loading = true;
        this.authorizationFilter.idUsuario = 23;
        this.authorizationFilter.codigoModulo = 'A001';

        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(data => {

                    debugger;
                    this.moduloService.getModulosPermitidos(this.model.username)
                        .subscribe(dataModulos => {

                            debugger;

                                this.modulos = dataModulos;
                                localStorage.setItem("authKey", JSON.stringify(this.modulos));
                                //second service
                                this.authenticationService.authenticateUser(this.model.username)
                                    .subscribe(dataAuthenticate => {

                                            debugger;
                                            this.currentUser = dataAuthenticate;
                                            localStorage.setItem("sessionId", JSON.stringify(this.currentUser));
                                            //3er service
                                            this.storageService.retrieveComboLocalStorage(this.authorizationFilter).subscribe(
                                                data => {

                                                    debugger;

                                                    this.storageService.localStorageValuesCommons(data);

                                                    let source1 = Rx.Observable
                                                        .of(
                                                            this.navigateRolByDefault()
                                                        )
                                                        .toPromise()
                                                        .catch(err => {
                                                            this.handleError(err);
                                                        });
                                                    source1.then((value) => {
                                                    });

                                                },
                                                error => {
                                                    this.error = 'Contacta al administrador';
                                                    this.handleError(error);
                                                    this.loading = false;
                                                })

                                        },
                                        error => {
                                            this.error = 'Usuario o contraseña es incorrecto.';
                                            this.handleError(error);
                                            this.loading = false;
                                        });
                            },
                            error => {
                                this.error = 'Usuario no tiene m&oacute;dulos asignados.';
                                this.handleError(error);
                                this.loading = false;
                            });
                },
                error => {
                    this.error = error.json().message;
                    this.handleError(error);
                    this.loading = false;
                });


    }

    private navigateRolByDefault() {

        debugger;

        let rolByDefault;


        this.currentUser = JSON.parse(localStorage.getItem("sessionId") || '{}');


        var index;
        for (index = 0; index < this.currentUser.assignedRoles.length; index++) {
            var r = this.currentUser.assignedRoles[index]
            if (r.assigned && r.roleName == 'RHANA' && r.roleDefault == true) {
                rolByDefault = r.roleName;
            }
            else if (r.assigned && r.roleName == 'EMPLE' && r.roleDefault == true) {
                rolByDefault = r.roleName;
            }
            else if (r.assigned && r.roleName == 'GEREN' && r.roleDefault == true) {
                rolByDefault = r.roleName;
            }
            else if (r.assigned && r.roleName == 'ADMIN' && r.roleDefault == true) {
                rolByDefault = r.roleName;
            }
            else if (r.assigned && r.roleDefault == true) {
                rolByDefault = r.roleName;
            }
        }
        if (rolByDefault == 'RHANA') {
            //this.router.navigate(['/dashboard/principalAnalistaRRHH']);
            this.router.navigate(['/dashboard/analytics']);
        }
        else if (rolByDefault == 'EMPLE') {
            //this.router.navigate(['/dashboard/principal']);
            this.router.navigate(['/dashboard/analytics']);
        }
        else if (rolByDefault == 'GEREN') {
            //this.router.navigate(['/dashboard/principalJefe']);
            this.router.navigate(['/dashboard/analytics']);
        }
        else if (rolByDefault == 'ADMIN') {
            //this.router.navigate(['/organizacion/busquedaEmpresa']);
            this.router.navigate(['/dashboard/analytics']);
        }
        else {
            this.router.navigate(['/miscellaneous/blank']);
        }

    }

    private handleError(error: Response) {
        return Observable.throw(error.json() || 'Error del Servidor');
    }

}
