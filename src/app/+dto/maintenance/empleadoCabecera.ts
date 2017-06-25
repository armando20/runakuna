import {DocumentoEmpleado} from "./documentoEmpleado";

export class EmpleadoCabecera{

     constructor(
         public idEmpleado?: number,
         public idEmpresa?: number,
         public nombre?: string,
         public apellidoPaterno?: string,
         public apellidoMaterno?:string,
         public nombreCompletoEmpleado?:string,
         public fotoPerfil:DocumentoEmpleado = new DocumentoEmpleado()

     ) { }


}
