import {Vacacion} from "./maintenance/vacacion";
export class EmpleadoPlanillaResult{

     constructor(
         public idEmpleado?: number,
         public nombre?: string,

         public apellidoPaterno?: string,
         public apellidoMaterno?:string,
         public nombreCompletoEmpleado?:string,

         public vacacionesEmpleado: Vacacion[] = []

     ) {
     }


}
