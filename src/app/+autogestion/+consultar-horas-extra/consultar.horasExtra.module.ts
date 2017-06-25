import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule,JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import {SmartadminModule} from "../../shared/smartadmin.module";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {InputsModule} from "@progress/kendo-angular-inputs";
import {InputMaskModule} from "primeng/primeng";
import {HorasExtrasDialogFormComponent} from "./horasExtras.dialog.component";
import {TextMaskModule} from "angular2-text-mask";
import {GrowlModule} from "primeng/components/growl/growl";
import {LayoutModule} from "@progress/kendo-angular-layout";
import {AccordionModule} from "primeng/components/accordion/accordion";
import {ConsultarHorasExtraComponent} from "./consultar.horasExtra.component";
import {LoadingIndicatorModule} from "../../+common/Utils/loader/LoadingIndicatorModule";

@NgModule({
  imports: [
      CommonModule,
      SmartadminModule,
      ButtonsModule,
      HttpModule,
      JsonpModule,
      GridModule,
      DropDownsModule,
      DialogModule,
      UploadModule,
      FormsModule,
      ReactiveFormsModule,
      SmartadminInputModule,
      SmartadminValidationModule,
      JqueryUiModule,
      InputsModule,
      GrowlModule,
      InputMaskModule,
      TextMaskModule,
      LayoutModule,
      AccordionModule,
      LoadingIndicatorModule

],
    declarations: [ConsultarHorasExtraComponent, HorasExtrasDialogFormComponent],
    bootstrap: [ConsultarHorasExtraComponent]
})
export class ConsultarHorasExtraModule {


}
