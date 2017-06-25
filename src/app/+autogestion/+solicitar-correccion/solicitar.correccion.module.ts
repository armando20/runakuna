import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SmartadminModule} from "../../shared/smartadmin.module";
import {SmartadminInputModule} from "../../shared/forms/input/smartadmin-input.module";
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import {HttpModule, JsonpModule} from "@angular/http";
import {ButtonsModule} from "@progress/kendo-angular-buttons";
import {UploadModule} from "@progress/kendo-angular-upload";
import {SmartadminValidationModule} from "../../shared/forms/validation/smartadmin-validation.module";
import {JqueryUiModule} from "../../shared/ui/jquery-ui/jquery-ui.module";
import {SolicitarCorreccionComponent} from "./solicitar.correccion.component";
import {GrowlModule} from "primeng/components/growl/growl";
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
    GrowlModule,
    LoadingIndicatorModule
  ],
  declarations: [SolicitarCorreccionComponent],
  providers: [],
  bootstrap: []
})

export class SolicitarCorreccionModule {}