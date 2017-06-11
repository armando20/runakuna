import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "app/+auth/+services/authentication.service";
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  model: any = {};
  error = '';

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  login(event) {
    debugger;

    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(data => {

          debugger;



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
