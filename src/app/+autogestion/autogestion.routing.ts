/**
 * Created by josediaz on 6/25/17.
 */
import {RouterModule, Routes} from "@angular/router";
import {PermisoComponent} from "./+solicitar-permiso/permiso.component";
import {AgendarVacacionesComponent} from "./+agendar-vacaciones/agendarVacaciones.component";
import {DatosPersonalesComponent} from "./+datos-personales/datos.personales.component";
import {SolicitarHorasExtraComponent} from "./+solicitar-horas-extra/solicitarHorasExtras.component";
import {SolicitarCorreccionComponent} from "./+solicitar-correccion/solicitar.correccion.component";
import {SolicitarLicenciaComponent} from "./+solicitar-licencia/solicitar.licencia.component";
import {ConsultarAsistenciaComponent} from "./+consultar-asistencia/consultar.asistencia.component";
import {ConsultarPermisoComponent} from "./+consultar-permiso/consultar.permiso.component";
import {ConsultarVacacionesComponent} from "./+consultar-vacaciones/consultar.vacaciones.component";
import {ConsultarHorasExtraComponent} from "./+consultar-horas-extra/consultar.horasExtra.component";
import {ConsultarLicenciaComponent} from "./+consultar-licencia/consultar.licencia.component";
import {EditarConsultaLicenciaComponent} from "./+editar-consultar-licencia/editar.consulta.licencia.component";
import {SolicitarCambioMarcacionComponent} from "./+solicitar-cambio-marcacion/solicitar.cambio.marcacion.component";

export const autogestionRoutes: Routes = [
    {
        path: '',
        redirectTo: 'consultarPermiso',
        pathMatch: 'full'
    },
    {
        path: 'actualizarDatosPersonales',
        component: DatosPersonalesComponent
    },
    {
        path: 'consultarPermiso',
        component: ConsultarPermisoComponent
    },
    {
        path: 'consultarVacaciones',
        component: ConsultarVacacionesComponent
    },
    {
        path: 'solicitarPermiso',
        component: PermisoComponent
    },
    {
        path: 'agendarVacaciones',
        component: AgendarVacacionesComponent
    },
    {
        path: 'solicitarCorreccion',
        component: SolicitarCorreccionComponent
    },
    {
        path: 'consultarHorasExtra',
        component: ConsultarHorasExtraComponent
    },
    {
        path: 'solicitarHorasExtra',
        component: SolicitarHorasExtraComponent
    },
    {
        path: 'consultarLicencia',
        component: ConsultarLicenciaComponent
    },
    {
        path: 'solicitarLicencia',
        component: SolicitarLicenciaComponent
    },
    {
        path: 'consultarAsistencia',
        component: ConsultarAsistenciaComponent
    },
    {
        path: 'editarConsultaLicencia',
        component: EditarConsultaLicenciaComponent
    },
    {
        path: 'solicitarCambioMarcacion',
        component: SolicitarCambioMarcacionComponent
    }
];

export const autogestionRouting = RouterModule.forChild(autogestionRoutes)

