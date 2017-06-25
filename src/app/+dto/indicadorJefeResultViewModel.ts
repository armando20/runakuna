/**
 * Created by javier.cuicapuza on 5/15/2017.
 */
export class IndicadorJefeResultViewModel {

    constructor(
        public countEmpleadoVacacionHoy?:number,
        public countEmpleadoLicenciaByDay?:number,
        public countTardanzasPromedioAlDiaxMes?:number,
        public countInasistenciasxMes?:number,
        public countLicenciaxMes?:number,
        public countBirthdayByMonth?:number
    ) { }

}