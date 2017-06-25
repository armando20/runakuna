import {Component, OnInit} from "@angular/core";


import {CompleterData, CompleterService} from "ng2-completer";
import {BackendService} from "../../+rest/backend.service";
import {ComponentBase} from "app/+common/service/componentBase";

/**
 * Created by josediaz on 6/25/17.
 */






@Component({
    selector: 'busqueda-usuarios',
    templateUrl: 'busqueda.usuarios.component.html'
})
export class BusquedaUsuariosComponent extends ComponentBase implements OnInit {

    private dataServiceEmpleado:CompleterData;

    constructor(public backendService: BackendService,private completerService: CompleterService){

        super(backendService, 'SE001');
    }

    ngOnInit(): void {

        this.dataServiceEmpleado =
            this.completerService.remote(this.urlAutocompleteEmpleado,'nombreEmpleado','nombreEmpleado');

    }


}