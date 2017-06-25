/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
export class LicenciaResult {

    constructor(
        public idHorasExtra?:number,
        public nombreJefeInmediato?: string,
        public nombreEmpleado?: string,
        public fecha?: string,
        public horas?:string,
        public estado?: string,
        public diaEnteroString?:string,
        public nombreDiaEntero?: string,
        public jefeInmediato?: string,
        public nombreTipoLicencia?: string,
        public fechaInicio?:string,
        public fechaFin?:string,
        public dias?:number,
        public idLicencia?:number
    ) { }



}