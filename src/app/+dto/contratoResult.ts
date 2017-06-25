export class ContratoResult {

     constructor(
         public idContrato?: number,
         public nombreCompletoEmpleado?: string,
         public tipoContrato?: string,
         public fechaInicio?: string,
         public fechaFin?: string,
         public duracion?:string,
         public cargo?:string,
         public salario?:number,
         public estado?:string
     ) {}


}