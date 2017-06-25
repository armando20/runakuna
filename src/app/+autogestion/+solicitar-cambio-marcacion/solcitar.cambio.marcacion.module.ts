import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {DialogModule} from "@progress/kendo-angular-dialog";
import {GridModule} from "@progress/kendo-angular-grid";
import {UploadModule} from "@progress/kendo-angular-upload";
import {DropDownsModule} from "@progress/kendo-angular-dropdowns";
import {JsonpModule, HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {Ng2CompleterModule} from "ng2-completer";
import {SolicitarCambioMarcacionComponent} from "./solicitar.cambio.marcacion.component";
import {InputMaskModule} from "primeng/primeng";
import {GrowlModule} from "primeng/components/growl/growl";
import {LayoutModule} from "@progress/kendo-angular-layout";
import {TextMaskModule} from "angular2-text-mask";
import {LoadingIndicatorModule} from "../../+common/Utils/loader/LoadingIndicatorModule";

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
        LoadingIndicatorModule,
        InputMaskModule,
        GrowlModule,
        LayoutModule,
        TextMaskModule
    ],
    declarations: [SolicitarCambioMarcacionComponent],
    bootstrap: [SolicitarCambioMarcacionComponent],
    entryComponents: [SolicitarCambioMarcacionComponent],
})
export class SolicitarCambioMarcacionModule {

}
