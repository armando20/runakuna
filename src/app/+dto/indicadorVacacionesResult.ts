/**
 * Created by javier.cuicapuza on 5/19/2017.
 */
export class IndicadorVacacionesResult{

    constructor(
        public nombreEmpleado?: string,
        public periodo?: string,
        public diasHabiles?: number,
        public semaforo?:string
    ) { }


}