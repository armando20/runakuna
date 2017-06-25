export class VacacionPendienteResult{

    constructor(
        public  codigo?:string,
        public  nombreEmpleado?:string,
        public  apellidoPaterno?:string,
        public  apellidoMaterno?:string,
        public  periodo?:string,
        public  maxDiasVacacionesPeriodo?:number,
        public  diasHabilesVacacionesDisponibles?:number,
        public  diasCalendarioVacacionesDisponibles?:number,
        public  diasHabilesVacacionesUsadas?:number,
        public  diasCalendarioVacacionesUsadas?:number

    ) { }


}