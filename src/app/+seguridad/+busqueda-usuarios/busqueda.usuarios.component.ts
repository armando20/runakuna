import {Component, OnInit} from "@angular/core";


import {CompleterData, CompleterService} from "ng2-completer";
import {BackendService} from "../../+rest/backend.service";
import {ComponentBase} from "app/+common/service/componentBase";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {Router} from "@angular/router";
import {UsuarioService} from "../../+common/service/usuario.service";

/**
 * Created by josediaz on 6/25/17.
 */






@Component({
    selector: 'busqueda-usuarios',
    templateUrl: 'busqueda.usuarios.component.html'
})
export class BusquedaUsuariosComponent extends ComponentBase implements OnInit {

    private dataServiceEmpleado:CompleterData;

    constructor(private empleadoService: EmpleadoService,
                private _router: Router,
                private usuarioService: UsuarioService,
                public backendService: BackendService,
                private completerService: CompleterService){
        super(backendService,'SE001');
    }

    ngOnInit(): void {

        this.dataServiceEmpleado =
            this.completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

    }


}