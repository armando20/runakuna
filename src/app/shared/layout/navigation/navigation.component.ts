import {Component, OnInit} from '@angular/core';
import {LoginInfoComponent} from "../../user/login-info/login-info.component";
import {Modulo} from "../../../+dto/maintenance/modulo";


@Component({

  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {


  private modulos: Array<Modulo> = [];


  constructor() {

    this.modulos = JSON.parse(localStorage.getItem("authKey") || '{}');

  }
}
