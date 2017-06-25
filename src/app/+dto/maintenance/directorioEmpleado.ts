import {DocumentoEmpleado} from "./documentoEmpleado";
import {Educacion} from "./educacion";
import {ExperienciaLaboral} from "./experienciaLaboral";
import {EquipoEntregado} from "./equipoEntregado";
import {Dependiente} from "./dependiente";
import {Licencia} from "./licencia";
import {AuditingEntity} from "../auditingEntity";

export class DirectorioEmpleado extends AuditingEntity{

     constructor(
         public idEmpleado?: number,
         public nombreCompleto?: string,
         public emailInterno?:string,
         public anexoInterno?:string,
         public telefonoCasa?:string,
         public telefonoCelular?:string,
         public telefonoAdicional?:string,
         public emailPersonal?:string,
         public foto?:string,
         public proyecto?:string,
         public cargo?:string,

     ) {
          super();
     }


}
