import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {GridModule} from "@progress/kendo-angular-grid";
import {DialogModule} from "@progress/kendo-angular-dialog";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {HttpModule, JsonpModule} from "@angular/http";
import {UploadModule} from "@progress/kendo-angular-upload";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";

import {Ng2CompleterModule} from "ng2-completer";
import {BusquedaUsuariosComponent} from "./busqueda.usuarios.component";
import {LayoutModule} from "@progress/kendo-angular-layout";
import {GrowlModule} from "primeng/components/growl/growl";

import {LoadingIndicatorModule} from "../../+common/Utils/loader/LoadingIndicatorModule";
import {ConfirmModule} from "../../shared/confirm/confirm.module";



@NgModule({
    imports: [
        CommonModule,
        SmartadminValidationModule,
        DropDownsModule,
        SmartadminInputModule,
        GridModule,
        DialogModule,
        SmartadminModule,
        HttpModule,
        JsonpModule,
        UploadModule,
        ReactiveFormsModule,
        FormsModule,
        JqueryUiModule,
        Ng2CompleterModule,
        LayoutModule,
        GrowlModule,
        ConfirmModule,
        LoadingIndicatorModule

    ],
    declarations: [BusquedaUsuariosComponent],
    bootstrap: [BusquedaUsuariosComponent],
    entryComponents: [BusquedaUsuariosComponent],
})
export class BusquedaUsuariosModule {

}