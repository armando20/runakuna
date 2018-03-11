import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";


declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';

  constructor(private router: Router) { }

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

  login(){
    debugger;

    this.router.navigate(['/dashboard/analytics'])
  }

}
