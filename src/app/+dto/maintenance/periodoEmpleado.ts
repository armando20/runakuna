import {AuditingEntity} from "../auditingEntity";
export class PeriodoEmpleado extends AuditingEntity{

     constructor(
         public idPeriodoEmpleado?: number,
         public idEmpleado?:number,
         public periodo?: string,
         public permisosUsados?: string,
         public permisosPermitidos?:string,
         public fechaInicio?:string,
         public fechaFin?:string,
         public diasVacacionesDisponibles?:number,
         public diasVacacionesAcumulado?:number,
         public permisosDisponibles?:number,
         public diasCalendariosDisponibles?:number

     ) {
          super();
     }


}