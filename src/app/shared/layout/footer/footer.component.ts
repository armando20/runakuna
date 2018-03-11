import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sa-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

    build: string;
    revision: string;
    timestamp: string;
    //currentUser: CurrentUser = new CurrentUser();

    constructor() {
    }

    ngOnInit() {
    }

}
