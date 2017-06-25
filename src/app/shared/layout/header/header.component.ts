import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Message} from "primeng/components/common/api";


declare var $: any;

@Component({
  selector: 'sa-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  msgs: Message[] = [];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }


  searchMobileActive = false;

  toggleSearchMobile(){
    this.searchMobileActive = !this.searchMobileActive;

    $('body').toggleClass('search-mobile', this.searchMobileActive);
  }

  onSubmit() {
    this.router.navigate(['/miscellaneous/search']);

  }
}
