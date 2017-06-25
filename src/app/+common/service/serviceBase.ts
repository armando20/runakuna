import {Response} from "@angular/http";
import {Observable} from "rxjs";

declare var $: any;
export class ServiceBase {



    constructor(){
    }

    protected handleError(error: Response) {
        return Observable.throw(error.json() || 'Server error');
    }


}
