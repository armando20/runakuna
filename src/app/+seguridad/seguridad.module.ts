import {NgModule} from "@angular/core";
import {seguridadRouting} from "./seguridad.routing";
import {BusquedaUsuariosModule} from "./+busqueda-usuarios/busqueda.usuarios.module";
import {UsuarioService} from "../+common/service/usuario.service";
import {RolService} from "../+common/service/rol.service";
import {EmpleadoService} from "../+common/service/empleado.service";
import {AdministrarUsuariosModule} from "./+administrar-usuarios/administrar.usuarios.module";


/**
 * Created by josediaz on 6/25/17.
 */



@NgModule({
    declarations: [
    ],
    imports: [
        seguridadRouting,
        BusquedaUsuariosModule,
        AdministrarUsuariosModule
    ],
    providers: [
        EmpleadoService,RolService,UsuarioService
    ],
})

export class SeguridadModule {}