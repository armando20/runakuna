/**
 * Created by josediaz on 6/25/17.
 */


import {NgModule} from "@angular/core";

import {autogestionRouting} from './autogestion.routing';
import {PermisoModule} from "./+solicitar-permiso/permiso.module";
import {PermisoService} from "../+common/service/permiso.service";
import {AgendarVacacionesModule} from "./+agendar-vacaciones/agendarVacaciones.module";
import {DatosPersonalesModule} from "./+datos-personales/datos.personales.module";
import {EmpleadoService} from "../+common/service/empleado.service";
import {SolicitarCorreccionModule} from "./+solicitar-correccion/solicitar.correccion.module";
import {SolicitarHorasExtraModule} from "./+solicitar-horas-extra/solicitarHorasExtras.module";
import {SolicitarLicenciaModule} from "./+solicitar-licencia/solicitar.licencia.module";
import {LicenciaService} from "../+common/service/licencia.service";
import {ConsultarAsistenciaModule} from "./+consultar-asistencia/consultar.asistencia.module";
import {ConsultarPermisoModule} from "./+consultar-permiso/consultar.permiso.module";
import {ConsultarVacacionesModule} from "./+consultar-vacaciones/consultar.vacaciones.module";
import {ConsultarHorasExtraModule} from "./+consultar-horas-extra/consultar.horasExtra.module";
import {ConsultarLicenciaModule} from "./+consultar-licencia/consultar.licencia.module";
import {EditarConsultaLicenciaModule} from "./+editar-consultar-licencia/editar.consulta.licencia.module";
import {SolicitarCambioMarcacionModule} from "./+solicitar-cambio-marcacion/solcitar.cambio.marcacion.module";
import {PeriodoEmpleadoService} from "../+common/service/periodoEmpleado.service";

@NgModule({
    declarations: [
    ],
    imports: [
        autogestionRouting,
        PermisoModule,
        AgendarVacacionesModule,
        DatosPersonalesModule,
        SolicitarHorasExtraModule,
        SolicitarCorreccionModule,
        SolicitarLicenciaModule,
        ConsultarAsistenciaModule,
        ConsultarPermisoModule,
        ConsultarVacacionesModule,
        ConsultarHorasExtraModule,
        ConsultarLicenciaModule,
        EditarConsultaLicenciaModule,
        SolicitarCambioMarcacionModule

    ],
    providers: [
        PermisoService,
        EmpleadoService,
        LicenciaService,
        PeriodoEmpleadoService
    ],
})
export class AutogestionModule {}

