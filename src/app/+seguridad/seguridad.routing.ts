import {RouterModule, Routes} from "@angular/router";
import {BusquedaUsuariosComponent} from "./+busqueda-usuarios/busqueda.usuarios.component";



/**
 * Created by josediaz on 6/25/17.
 */






export const seguridadRoutes: Routes = [

    {
        path: 'busquedaUsuarios',
        component: BusquedaUsuariosComponent
    }


];

export const seguridadRouting = RouterModule.forChild(seguridadRoutes)