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
import {PermisoService} from "../../+common/service/permiso.service";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {SolicitarLicenciaComponent} from "./solicitar.licencia.component";
import {Ng2CompleterModule} from "ng2-completer";
import {InputMaskModule} from "primeng/primeng";
import {LicenciaDocumentEditComponent} from "./solicitar.licencia.edit.form";
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
      SmartadminModule,
      HttpModule,
      JsonpModule,
      UploadModule,
      ReactiveFormsModule,
      FormsModule,
      JqueryUiModule,
      Ng2CompleterModule,
      InputMaskModule,
      GrowlModule,
      LoadingIndicatorModule
  ],
    declarations: [SolicitarLicenciaComponent,LicenciaDocumentEditComponent],
    providers: [
        PermisoService
    ],
    bootstrap: [SolicitarLicenciaComponent]
})
export class SolicitarLicenciaModule {


}
