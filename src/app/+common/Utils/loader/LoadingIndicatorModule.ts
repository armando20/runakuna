import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LoadingIndicator} from "./loadingIndicator";
/**
 * Created by javier.cuicapuza on 5/8/2017.
 */
@NgModule({
    imports: [

        CommonModule],
    declarations: [LoadingIndicator],
    exports: [LoadingIndicator],

})
export class LoadingIndicatorModule{}