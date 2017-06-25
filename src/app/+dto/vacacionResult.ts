/**
 * Created by javier.cuicapuza on 1/10/2017.
 */
export class VacacionResult{

    constructor(
        public idVacacion?: number,
        public nombreEmpleado?: string,
        public fechaInicio?: string,
        public fechaFin?: string,

        public desde?: Date,
        public hasta?: Date,
        public diasCalendarios?: number,
        public diasHabiles?: number,
        public nombreJefeInmediato?:string,
        public nombreIncluidoPlanilla?:string,
        public incluidoPlanilla?:boolean,
        public estado?:string,
        public idPeriodoEmpleado?:number,
        public periodo?:string,
        public tipo?:string,
        public mesPlanilla?:string
    ) { }


}