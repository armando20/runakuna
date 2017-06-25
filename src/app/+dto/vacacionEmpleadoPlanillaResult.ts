import {VacacionResult} from "./vacacionResult";
export class VacacionEmpleadoPlanillaResult{

     constructor(
         public mes?: number,
         public anio?: number,

         public vacacionesEnPlanilla: VacacionResult[] = []

     ) {
     }


}
