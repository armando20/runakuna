/**
 * Created by javier.cuicapuza on 5/31/2017.
 */
import {AuditingEntity} from "../auditingEntity";
export class PermisoEmpleadoRecuperacion extends AuditingEntity{
    constructor(
        public idPermisoEmpleadoRecuperacion?: number,
        public idPermisoEmpleado?: number,
        public fechaRecuperacion?:string,
        public horaInicio?:string,
        public horaFin?:string,
        public horas?:string,

    ){
        super();
    }
}