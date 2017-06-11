/**
 * Created by griga on 7/11/16.
 */


import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {ModuleWithProviders} from "@angular/core";
import { LoginComponent } from "app/+auth/+login/login.component";
import {AuthGuard} from "./+auth/+guards/auth.guards";

export const routes: Routes = [
  
  {path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    data: {pageTitle: 'Home'},
    canActivate: [AuthGuard],
    children: [
      {
        path: '', redirectTo: 'dashboard/analytics', pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: 'app/+dashboard/dashboard.module#DashboardModule',
        data: {pageTitle: 'Dashboard'}
      }
    ]
  },

  {path: '**', redirectTo: 'miscellaneous/error404'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
