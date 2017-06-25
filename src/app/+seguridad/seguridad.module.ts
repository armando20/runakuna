import {NgModule} from "@angular/core";
import {seguridadRouting} from "./seguridad.routing";
import {BusquedaUsuariosModule} from "./+busqueda-usuarios/busqueda.usuarios.module";
import {UsuarioService} from "../+common/service/usuario.service";
import {RolService} from "../+common/service/rol.service";
import {EmpleadoService} from "../+common/service/empleado.service";


/**
 * Created by josediaz on 6/25/17.
 */



@NgModule({
    declarations: [
    ],
    imports: [
        seguridadRouting,
        BusquedaUsuariosModule,
    ],
    providers: [
        EmpleadoService,RolService,UsuarioService
    ],
})

export class SeguridadModule {}