/**
 * Created by javier.cuicapuza on 2/21/2017.
 */
export class PeriodoEmpleadoResult{

    constructor(
        public idPeriodoEmpleado?: number,
        public nombreEmpleado?: string,
        public fechaInicio?: string,
        public fechaFin?:string,
        public maxDiasVacaciones?:string,
        public diasVacacionesDisponibles?:string,
        public diasVacacionesAcumulado?:number,
        public maxPermisos?:string,
        public permisosDisponibles?:number,
        public diasVacacionesPorVencer?:number,
        public idEmpleado?:number,
        public periodo?:string
    ) { }


}
