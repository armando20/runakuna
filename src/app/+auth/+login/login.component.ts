import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "app/+auth/+services/authentication.service";
import { Observable } from "rxjs/Rx";
import {ModuloService} from "../../shared/layout/navigation/http-modulo-service";
import {StorageService} from "../../+common/storageLocalValues/storage.service";
import {AutorizacionFilter} from "../../+dto/autorizacionFilter";
import {AssignedRole} from "../../+dto/assignedRole";
import {Modulo} from "../../+dto/maintenance/modulo";
import {CurrentUser} from "../../+dto/currentUser";

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

  constructor(
      private router: Router,
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

  resizeWindow () {
    $('.content-login').css("height", $(window).height() + "px");
  }

  login(event) {
    debugger;

    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(data => {

          debugger;
          this.router.navigate(['/dashboard/analytics']);


      },
      error => {
        this.error = error.json().message;;
        this.handleError(error);

      })
        
  }

  private handleError(error: Response) {
    return Observable.throw(error.json() || 'Error del Servidor');
  }

}
