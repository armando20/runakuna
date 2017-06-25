/**
 * Created by javier.cuicapuza on 1/3/2017.
 */
/**
 * Created by javier.cuicapuza on 12/27/2016.
 */
import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule,JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {Ng2CompleterModule} from "ng2-completer";
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import {AdministrarUsuariosComponent} from "./administrar.usuarios.component";
import {GrowlModule} from "primeng/components/growl/growl";
import {LoadingIndicatorModule} from "../../+common/Utils/loader/LoadingIndicatorModule";


@NgModule({
    imports: [
        CommonModule,
        SmartadminValidationModule,
        DropDownsModule,
        SmartadminInputModule,
        GridModule,
        DialogModule,
        ButtonsModule,
        SmartadminModule,
        HttpModule,
        JsonpModule,
        UploadModule,
        ReactiveFormsModule,
        FormsModule,
        JqueryUiModule,
        Ng2CompleterModule,
        GrowlModule,
        LoadingIndicatorModule
    ],
    declarations: [AdministrarUsuariosComponent],
    providers: [

    ],
    bootstrap: [AdministrarUsuariosComponent]
})
export class AdministrarUsuariosModule {


}
