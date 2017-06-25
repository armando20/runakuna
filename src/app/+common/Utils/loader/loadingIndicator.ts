import {Component, Injectable} from "@angular/core";
/**
 * Created by javier.cuicapuza on 5/5/2017.
 */
@Component({
    selector: 'loading-indicator',
    template: `
        <div class="loading-layout">
            <div class="spinner">
                <div class="box"></div>
                <div class="box"></div>
                <div class="box"></div>
                <div class="box"></div>
            </div>
        </div>
        `
})
export class LoadingIndicator {

}