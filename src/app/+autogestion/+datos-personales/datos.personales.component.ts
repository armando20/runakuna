import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {TablaGeneralResult} from "../../+dto/tablaGeneralResult";
import {Empleado} from "../../+dto/maintenance/empleado";
import {PeriodoEmpleado} from "../../+dto/maintenance/periodoEmpleado";
import {NotificacionResult} from "../../+dto/notificacionResult";
import {EmpleadoService} from "../../+common/service/empleado.service";
import {PaisService} from "../../+common/service/pais.service";
import {Dependiente} from "../../+dto/maintenance/dependiente";
import {GridDataResult, PageChangeEvent} from "@progress/kendo-angular-grid";
import {ExperienciaLaboral} from "../../+dto/maintenance/experienciaLaboral";
import {DependienteDialogFormComponent} from "./dependiente.dialog.component";
import {ExperienciaLaboralDatosPersonalesDialogFormComponent} from "./experienciaLaboralDatosPersonales.dialog.component";
import {ComponentBase} from "../../+common/service/componentBase";
import {VacacionService} from "../../+common/service/vacacion.service";
import {Educacion} from "../../+dto/maintenance/educacion";
import {EducacionDatosPersonalesDialogFormComponent} from "./educacionDatosPersonales.dialog.component";
import {HorasExtraService} from "../../+common/service/horasExtra.service";
import {LicenciaService} from "../../+common/service/licencia.service";
import {Licencia} from "../../+dto/maintenance/licencia";
import {BackendService} from "../../+rest/backend.service";
import {DocumentoEmpleado} from "../../+dto/maintenance/documentoEmpleado";
import {EquipoEntregado} from "../../+dto/maintenance/equipoEntregado";
import {PaisCombo} from "../../+dto/paisCombo";
import {DepartamentoCombo} from "../../+dto/departamentoCombo";
import {ProvinciaCombo} from "../../+dto/provinciaCombo";
import {DistritoCombo} from "../../+dto/distritoCombo";

declare var $: any;

var moment = require('moment');

@Component({
    selector: 'sa-datos-personales',
    templateUrl: 'datos.personales.component.html',
    providers: [PaisService,VacacionService,HorasExtraService,LicenciaService],
})
export class DatosPersonalesComponent extends ComponentBase implements OnInit {

    public isEnableDepartamentoDomicilio:boolean;
    public isEnableProvinciaDomicilio:boolean;
    public isEnableDistritoDomicilio:boolean;

    public defaultItem:TablaGeneralResult={codigo:null,nombre:'Seleccionar', grupo:null};
    public defaultItemPais:PaisCombo={idPais:null,nombre:'Seleccionar'};
    public defaultItemDepartamento:DepartamentoCombo={idDepartamento:null,nombre:'Seleccionar'};
    public defaultItemProvincia:ProvinciaCombo={idProvincia:null,nombre:'Seleccionar'};
    public defaultItemDistrito:DistritoCombo={idDistrito:null,nombre:'Seleccionar'};
    public defaultItemPeriodo={idPeriodoEmpleado:null,periodo:'Todos'};

    public tiposDomicilio:TablaGeneralResult[];
    public relacionesContacto:TablaGeneralResult[];
    public paisesDomicilio:PaisCombo[]=[];
    public departamentosDomicilio:DepartamentoCombo[]=[];
    public provinciasDomicilio:ProvinciaCombo[]=[];
    public distritosDomicilio:DistritoCombo[]=[];

    private empleado:Empleado = new Empleado();
    private dependientes: Dependiente[]=[];
    private experienciasLaborales: ExperienciaLaboral[]=[];
    private educaciones: Educacion[]=[];
    private equiposEntregados: EquipoEntregado[]=[];

    private licencias:Licencia[]=[];
    private documentos: DocumentoEmpleado[]=[];
    private periodoEmpleadoLicencia:PeriodoEmpleado = new PeriodoEmpleado();
    private periodosEmpleados:PeriodoEmpleado[]=[];
    private fechaDesde:string;
    private fechaHasta:string;
    private tiempoTrabajado:string;
    private idPeriodoEmpleadoLicencia:number;
    private fotoEmpleado:string = '';
    private nombreCompletoEmpleado:string = '';
    private gridViewDependiente: GridDataResult;
    private gridViewExperienciaLaboral: GridDataResult;
    private gridViewEducacion: GridDataResult;
    private pageSizeExperienciaLaboral: number = 10;
    private skipExperienciaLaboral: number = 0;
    private pageSizeDependiente: number = 10;
    private skipDependiente: number = 0;
    private pageSizeEducacion: number = 10;
    private skipEducacion: number = 0;

    private classTab : {tabSelected:string,tabContentSelected:string}[]=[
        {tabSelected:'',tabContentSelected:'tab-pane'},
        {tabSelected:'',tabContentSelected:'tab-pane'},
        {tabSelected:'',tabContentSelected:'tab-pane'},
        {tabSelected:'',tabContentSelected:'tab-pane'},
        {tabSelected:'',tabContentSelected:'tab-pane'},
        {tabSelected:'',tabContentSelected:'tab-pane'}
    ];

    constructor(private empleadoService:EmpleadoService,
                public backendService: BackendService,
                private paisService:PaisService) {

        super(backendService,'AU001');

    }

    ngOnInit() {
        this.showLoading = true;
        let idEmpleado = this.currentUser.idEmpleado;
        let tabActive:string=localStorage.getItem('tabActive');
        this.inicializarTab(tabActive);
        this.inicializarCampos();
        this.isEnableDepartamentoDomicilio=true;
        this.isEnableProvinciaDomicilio=true;
        this.isEnableDistritoDomicilio=true;
        this.obtenerPaisesDomicilio();
        this.getTiposDomicilio();
        this.getRelacionesContacto();
        this.cargarInformacion(idEmpleado);
    }

    inicializarCampos(){
        this.fechaDesde = moment().subtract(7, 'days').format('DD/MM/YYYY');
        this.fechaHasta = moment().format('DD/MM/YYYY');
    }

    cargarInformacion(idEmpleado:number){
        this.cargarinformacionEmpelado(idEmpleado);
        localStorage.setItem('tabActive','');
    }

    cargarinformacionEmpelado(idEmpleado:number){
        this.verEmpleado(idEmpleado);
        this.verDependiente(idEmpleado);
        this.verExperienciaLaboral(idEmpleado);
        this.verEducacion(idEmpleado);
        this.verDocumentos(idEmpleado);
        this.verEquipoEntregado(idEmpleado);
    }

    verEmpleado(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.obtenerEmpleado(idEmpleado).subscribe(
            data => {
                this.cargarEmpleado(data);
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }

    verDocumentos(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.verDocumentos(idEmpleado).subscribe(
            data => {
                this.documentos = data;
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }

    verEducacion(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.verEducacion(idEmpleado).subscribe(
            data =>{
                this.educaciones = data;
                this.obtenerGridEducacion();
                this.showLoading = false;
            } ,
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }

    obtenerGridEducacion():void{
        if(this.educaciones.length>0){
            this.gridViewEducacion = {
                data: this.educaciones.slice(this.skipEducacion, this.skipEducacion + this.pageSizeEducacion),
                total: this.educaciones.length
            };
        }else{
            this.gridViewEducacion = {
                data: [],
                total: 0
            };
        }
    }

    verEquipoEntregado(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.verEquipoEntregado(idEmpleado).subscribe(
            data => {
                this.equiposEntregados = data;
                this.showLoading = false;
                },
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }

    verPeriodoEmpleado(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.verPeriodoEmpleado(idEmpleado).subscribe(
            data => {
                this.periodosEmpleados = data;
                if(this.periodosEmpleados != null && this.periodosEmpleados.length>0){
                    let periodoEmpleado: PeriodoEmpleado = new PeriodoEmpleado();
                    periodoEmpleado.idEmpleado = idEmpleado;
                    periodoEmpleado.idPeriodoEmpleado = this.periodosEmpleados[0].idPeriodoEmpleado;
                    periodoEmpleado.diasVacacionesDisponibles = this.periodosEmpleados[0].diasVacacionesDisponibles;
                }
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }

    cargarEmpleado(data:Empleado){

        this.actualizarDptoDomicilio(data.idPaisDomicilio);
        if(data.idDepartamentoDomicilio){
            this.actualizarProvinciaDomicilio(data.idDepartamentoDomicilio);
            if(data.idProvinciaDomicilio != null){
                this.actualizarDistritoDomicilio(data.idProvinciaDomicilio);
            }
        }

        this.nombreCompletoEmpleado = data.nombreCompletoEmpleado;
        if(data.fotoPerfil != null) {
            this.fotoEmpleado = "data:image/jpeg;base64," +  data.fotoPerfil.contenidoArchivo;
            $('#fotoEmpleado').prop("style","display: block; border-radius: 4px 4px; height: 100px");
            $('#iconPerson').prop("class","");
        }

        this.empleado = data;

        if(data.fechaIngreso != null && data.fechaIngreso != '') {

            let fechaInicioCadena: string[] = data.fechaIngreso.split('/');
            let fechaIni: Date = new Date(parseInt(fechaInicioCadena[2]), parseInt(fechaInicioCadena[1]) - 1, parseInt(fechaInicioCadena[0]));

            let fechaFin: Date = new Date();

            this.duration(fechaIni, fechaFin);
        }

        this.empleado.edad = this.calculateAge(this.empleado.fechaNacimiento);
    }

    private getTiposDomicilio() {
        this.tiposDomicilio = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.TipoDomicilio' === grupo.grupo);
    }

    private getRelacionesContacto() {
        this.relacionesContacto = this.storageCommomnValueResult.tablaGeneral.filter(grupo => 'Empleado.RelacionContacto' === grupo.grupo);
    }

    private obtenerPaisesDomicilio() {
        this.showLoading = true;
        this.paisService.completarComboPais().subscribe(
            paisDto => {
                this.paisesDomicilio = paisDto;
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            });
    }

    private obtenerDepartamentosDomicilio(idPais:number) {
        this.showLoading = true;
        this.paisService.completarComboDepartamento(idPais).subscribe(
            departamentoDto => {
                this.departamentosDomicilio = departamentoDto;
                this.showLoading = false;},
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            });
    }

    private obtenerProvinciasDomicilio(idDpto:number) {
        this.showLoading = true;
        this.paisService.completarComboProvincia(idDpto).subscribe(
            provinciasDto => {
                this.provinciasDomicilio = provinciasDto;
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            });
    }

    private obtenerDistritosDomicilio(idProvincia:number) {
        this.showLoading = true;
        this.paisService.completarComboDistrito(idProvincia).subscribe(
            distritosDto => {
                this.distritosDomicilio = distritosDto;
                this.showLoading = false;
                },
            error =>  {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            });
    }

    actualizarDptoDomicilio(value):void{

        this.isEnableDepartamentoDomicilio=false;

        let idPais:number = 1;

        if(value.idPais != undefined && value.idPais != null){
            idPais = value.idPais;
        }else{
            idPais = value;
        }

        this.empleado.idDepartamentoDomicilio = null;
        if(value == null) {
            this.departamentosDomicilio = null;
        }else {
            this.obtenerDepartamentosDomicilio(idPais);
        }

        this.empleado.idProvinciaDomicilio = null;
        this.empleado.idDistritoDomicilio = null;

        this.provinciasDomicilio = null;
        this.distritosDomicilio = null;

        this.isEnableProvinciaDomicilio=true;
        this.isEnableDistritoDomicilio=true;

    }

    actualizarProvinciaDomicilio(value):void{
        this.isEnableProvinciaDomicilio=false;

        let idDpto:number = 1;

        if(value.idDepartamento != undefined && value.idDepartamento != null){
            idDpto = value.idDepartamento;
        }else{
            idDpto = value;
        }

        this.empleado.idProvinciaDomicilio = null;
        if(value == null) {
            this.provinciasDomicilio = null;
        }else {
            this.obtenerProvinciasDomicilio(idDpto);
        }

        this.empleado.idDistritoDomicilio = null;
        this.distritosDomicilio = null;
        this.isEnableDistritoDomicilio=true;

    }

    actualizarDistritoDomicilio(value):void{
        this.isEnableDistritoDomicilio=false;

        let idProvincia:number = 1;

        if(value.idProvincia != undefined && value.idProvincia != null){
            idProvincia = value.idProvincia;
        }else{
            idProvincia = value;
        }

        this.empleado.idDistritoDomicilio = null;
        if(value == null) {
            this.distritosDomicilio = null;
        }else {
            this.obtenerDistritosDomicilio(idProvincia);
        }

    }

    verDependiente(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.verDependiente(idEmpleado).subscribe(
            data => {
                this.dependientes = data;
                this.obtenerGridDependiente();
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.handleError(error);
            }
        );
    }

    obtenerGridDependiente():void{
        if(this.dependientes.length>0){
            this.gridViewDependiente = {
                data: this.dependientes.slice(this.skipDependiente, this.skipDependiente + this.pageSizeDependiente),
                total: this.dependientes.length
            };
        }else{
            this.gridViewDependiente = {
                data: [],
                total: 0
            };
        }
    }

    verExperienciaLaboral(idEmpleado: number){
        this.showLoading = true;
        this.empleadoService.verExperienciaLaboral(idEmpleado).subscribe(
            data => {
                this.experienciasLaborales = data;
                this.obtenerGridExperienciaLaboral();
                this.showLoading = false;
            },
            error => {
                this.showLoading = false;
                this.backendService.notification(this.msgs,error);
            }
        );
    }

    obtenerGridExperienciaLaboral():void{
        if(this.experienciasLaborales.length>0){
            this.gridViewExperienciaLaboral = {
                data: this.experienciasLaborales.slice(this.skipExperienciaLaboral, this.skipExperienciaLaboral + this.pageSizeExperienciaLaboral),
                total: this.experienciasLaborales.length
            };
        }else{
            this.gridViewExperienciaLaboral = {
                data: [],
                total: 0
            };
        }
    }

    public dataItemDependiente: Dependiente;

    @ViewChild(DependienteDialogFormComponent) protected dependienteDialogComponent: DependienteDialogFormComponent;

    public agregarDependiente(): void {
        this.dependienteDialogComponent.tituloCabecera = "Agregar";
        this.dependienteDialogComponent.tituloBoton = "Agregar";
        this.dependienteDialogComponent.agregarDependiente();
    }

    public onEditarDependiente(dataItem: any): void {
        this.dependienteDialogComponent.tituloCabecera = "Editar";
        this.dependienteDialogComponent.tituloBoton = "Actualizar";
        this.dependienteDialogComponent.obtenerTipoDocumento();
        this.dependienteDialogComponent.obtenerRelacionDependiente();

        this.dataItemDependiente = dataItem;

        this.dependienteDialogComponent.nombreDependiente = this.dataItemDependiente.nombre;
        this.dependienteDialogComponent.apellidoPaternoDependiente = this.dataItemDependiente.apellidoPaterno;
        this.dependienteDialogComponent.apellidoMaternoDependiente = this.dataItemDependiente.apellidoMaterno;
        this.dependienteDialogComponent.tipoDocumentoDependiente = this.dataItemDependiente.tipoDocumento;
        this.dependienteDialogComponent.numeroDocumentoDependiente = this.dataItemDependiente.numeroDocumento;
        this.dependienteDialogComponent.relacionDependiente = this.dataItemDependiente.relacion;
        this.dependienteDialogComponent.fechaNacimientoDepediente = this.dataItemDependiente.fechaNacimiento;
        this.dependienteDialogComponent.nombreRelacionDepediente = this.dataItemDependiente.nombreRelacion;
        this.dependienteDialogComponent.nombreTipoDocumentoDependiente = this.dataItemDependiente.nombreTipoDocumento;

    }

    public onGuardarDependiente(dto: Dependiente): void {

        const operation = dto.idDependiente === undefined ?
            this.crearDependiente(dto) :
            this.editarDependiente(dto);

        this.obtenerGridDependiente();

    }

    public onEliminarDependiente(e: Dependiente): void {
        const operation = this.eliminarDependiente(e);
        this.obtenerGridDependiente();
    }

    public onCancelarDependiente(): void {
        this.dataItemDependiente = undefined;
    }

    public obtenerDependiente(): Observable<Dependiente[]> {
        return this.fetchDependiente();
    }

    public editarDependiente(data: Dependiente): Observable<Dependiente[]> {
        return this.fetchDependiente("update", data);
    }

    public crearDependiente(data: Dependiente): Observable<Dependiente[]> {
        data.idDependiente = this.generarIdDependienteTemporal();
        return this.fetchDependiente("create", data);

    }

    public eliminarDependiente(data: Dependiente): Observable<Dependiente[]> {
        return this.fetchDependiente("destroy", data);
    }

    private fetchDependiente(action: string = "", data?: Dependiente): Observable<Dependiente[]>  {

        if(action=="create"){
            var documento : Dependiente = (JSON.parse(JSON.stringify(data)));
            this.dependientes.push(documento);
        }else if(action=="update"){
            var indice = this.dependientes.indexOf(data);
            if(indice>=0)
                this.dependientes[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.dependientes.indexOf(data);

            if(indice>=0)
                this.dependientes.splice(indice, 1);

        }

        return Observable.of(this.dependientes);
    }

    generarIdDependienteTemporal():number {
        if (this.dependientes != null)
            return (this.dependientes.length + 2)* -1;
        else
            return-1;
    }

    protected pageChangeDependiente(event: PageChangeEvent): void {
        this.skipDependiente = event.skip;
        this.obtenerGridDependiente();

    }

    //experiencia Laboral

    public dataItemExperienciaLaboral: ExperienciaLaboral;

    @ViewChild(ExperienciaLaboralDatosPersonalesDialogFormComponent) protected editExperienciaLaboralFormComponent: ExperienciaLaboralDatosPersonalesDialogFormComponent;

    public onEditarExperienciaLaboral(dataItem: any): void {
        this.editExperienciaLaboralFormComponent.titulo = "Editar";
        this.editExperienciaLaboralFormComponent.tituloBoton = "Actualizar";
        this.dataItemExperienciaLaboral = dataItem;
        this.editExperienciaLaboralFormComponent.razonSocial = this.dataItemExperienciaLaboral.razonSocial;
        this.editExperienciaLaboralFormComponent.departamento = this.dataItemExperienciaLaboral.departamento;
        this.editExperienciaLaboralFormComponent.cargo = this.dataItemExperienciaLaboral.cargo;
        this.editExperienciaLaboralFormComponent.descripcion = this.dataItemExperienciaLaboral.descripcion;
        this.editExperienciaLaboralFormComponent.fechaInicio = this.dataItemExperienciaLaboral.fechaInicio;
        this.editExperienciaLaboralFormComponent.fechaFin = this.dataItemExperienciaLaboral.fechaFin;
    }

    public onCancelarExperienciaLaboral(): void {
        this.dataItemExperienciaLaboral = undefined;
    }

    public onAgregarExperienciaLaboral(dto: ExperienciaLaboral): void {

        const operation = dto.idExperienciaLaboral === undefined ?
            this.crearExperienciaLaboral(dto) :
            this.editarExperienciaLaboral(dto);

        this.obtenerGridExperienciaLaboral();

    }

    public onEliminarExperienciaLaboral(e: ExperienciaLaboral): void {
        const operation = this.eliminarExperienciaLaboral(e);
        this.obtenerGridExperienciaLaboral();
    }

    public agregarExperienciaLaboral(): void {
        this.editExperienciaLaboralFormComponent.titulo = "Agregar";
        this.editExperienciaLaboralFormComponent.tituloBoton = "Agregar";
        this.editExperienciaLaboralFormComponent.agregarExperienciaLaboral();
    }

    public obtenerExperienciasLaborales(): Observable<ExperienciaLaboral[]> {
        return this.fetchExperienciaLaboral();
    }

    public editarExperienciaLaboral(data: ExperienciaLaboral): Observable<ExperienciaLaboral[]> {
        return this.fetchExperienciaLaboral("update", data);
    }

    public crearExperienciaLaboral(data: ExperienciaLaboral): Observable<ExperienciaLaboral[]> {
        data.idExperienciaLaboral = this.generarIdExperienciaLaboralTemporal();
        return this.fetchExperienciaLaboral("create", data);

    }

    public eliminarExperienciaLaboral(data: ExperienciaLaboral): Observable<ExperienciaLaboral[]> {
        return this.fetchExperienciaLaboral("destroy", data);
    }

    private fetchExperienciaLaboral(action: string = "", data?: ExperienciaLaboral): Observable<ExperienciaLaboral[]>  {

        if(action=="create"){
            var model : ExperienciaLaboral = (JSON.parse(JSON.stringify(data)));
            this.experienciasLaborales.push(model);
        }else if(action=="update"){
            var indice = this.experienciasLaborales.indexOf(data);
            if(indice>=0)
                this.experienciasLaborales[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.experienciasLaborales.indexOf(data);

            if(indice>=0)
                this.experienciasLaborales.splice(indice, 1);

        }

        return Observable.of(this.experienciasLaborales);
    }

    generarIdExperienciaLaboralTemporal():number {
        if (this.experienciasLaborales != null)
            return (this.experienciasLaborales.length + 2)* -1;
        else
            return-1;
    }

    protected pageChangeExperienciaLaboral(event: PageChangeEvent): void {
        this.skipExperienciaLaboral = event.skip;
        this.obtenerGridExperienciaLaboral();

    }

    public dataItemEducacion: Educacion;

    @ViewChild(EducacionDatosPersonalesDialogFormComponent) protected educacionDialogComponent: EducacionDatosPersonalesDialogFormComponent;

    public agregarEducacion(): void {
        this.educacionDialogComponent.tituloCabecera = "Agregar";
        this.educacionDialogComponent.tituloBoton = "Agregar";
        this.educacionDialogComponent.agregarEducacion();

    }

    public onEditarEducacion(dataItem: any): void {
        this.educacionDialogComponent.tituloCabecera = "Editar";
        this.educacionDialogComponent.tituloBoton = "Actualizar";
        this.educacionDialogComponent.obtenerNivelEducacion();
        this.dataItemEducacion = dataItem;
        this.educacionDialogComponent.nivelEducacion = this.dataItemEducacion.nivelEducacion;
        this.educacionDialogComponent.institucion = this.dataItemEducacion.institucion;
        this.educacionDialogComponent.titulo = this.dataItemEducacion.titulo;
        this.educacionDialogComponent.descripcion = this.dataItemEducacion.descripcion;
        this.educacionDialogComponent.fechaInicio = this.dataItemEducacion.fechaInicio;
        this.educacionDialogComponent.fechaFin = this.dataItemEducacion.fechaFin;
        this.educacionDialogComponent.nombreNivelEducacion = this.dataItemEducacion.nombreNivelEducacion;
    }

    public onGuardarEducacion(dto: Educacion): void {

        const operation = dto.idEducacion === undefined ?
            this.crearEducacion(dto) :
            this.editarEducacion(dto);

        this.obtenerGridEducacion();

    }

    public onEliminarEducacion(e: Educacion): void {
        const operation = this.eliminarEducacion(e);

        this.obtenerGridEducacion();
    }

    public onCancelarEducacion(): void {
        this.dataItemEducacion = undefined;
    }

    public obtenerEducacion(): Observable<Educacion[]> {
        return this.fetchEducacion();
    }

    public editarEducacion(data: Educacion): Observable<Educacion[]> {
        return this.fetchEducacion("update", data);
    }

    public crearEducacion(data: Educacion): Observable<Educacion[]> {
        data.idEducacion = this.generarIdEducacionTemporal();
        return this.fetchEducacion("create", data);

    }

    public eliminarEducacion(data: Educacion): Observable<Educacion[]> {
        return this.fetchEducacion("destroy", data);
    }

    private fetchEducacion(action: string = "", data?: Educacion): Observable<Educacion[]>  {

        if(action=="create"){
            var documento : Educacion = (JSON.parse(JSON.stringify(data)));
            this.educaciones.push(documento);
        }else if(action=="update"){
            var indice = this.educaciones.indexOf(data);
            if(indice>=0)
                this.educaciones[indice]  = (JSON.parse(JSON.stringify(data)));
        }else if(action=="destroy"){
            var indice = this.educaciones.indexOf(data);

            if(indice>=0)
                this.educaciones.splice(indice, 1);

        }

        return Observable.of(this.educaciones);
    }

    generarIdEducacionTemporal():number {
        if (this.educaciones != null)
            return (this.educaciones.length + 2)* -1;
        else
            return-1;
    }

    protected pageChangeEducacion(event: PageChangeEvent): void {
        this.skipEducacion = event.skip;
        this.obtenerGridEducacion();

    }

    validarRequerido(){
        let validacion = false;


        if(this.empleado.direccionDomicilio === undefined || this.empleado.direccionDomicilio == null || this.empleado.direccionDomicilio==''){
            $('#direccion').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        if(this.empleado.tipoDomicilio === undefined || this.empleado.tipoDomicilio == null || this.empleado.tipoDomicilio==''){
            validacion = true;
        }

        if(this.empleado.idPaisDomicilio == null){
            validacion = true;
        }

        if(this.empleado.telefonoCelular === undefined || this.empleado.telefonoCelular == null || this.empleado.telefonoCelular==''){
            $('#celular').parent().addClass('state-error').removeClass('state-success');
            validacion = true;
        }

        return validacion;
    }

    ingresaDireccion(){
        $('#direccion').parent().removeClass('state-error');
    }

    ingresaCelular(){
        $('#celular').parent().removeClass('state-error');
    }

    onActualizarDatosPersonales(){
        this.empleado.dependientes = this.dependientes;
        this.empleado.experienciasLaborales = this.experienciasLaborales;
        this.empleado.educaciones = this.educaciones;
        this.empleado.documentos = this.documentos;
        this.empleado.equiposEntregados = this.equiposEntregados;

        if(this.validarRequerido()){
            this.msgs.push({severity: 'error', summary: 'Runakuna Error', detail:'Ingrese los campos obligatorios.'});
            return;
        }
        this.empleado.idEmpresa=this.currentUser.idEmpresa;

        this.showLoading  = true;

        this.empleadoService.actualizarDatosPersonalesEmpleado(this.empleado).subscribe(
            (data:NotificacionResult) => {
                this.backendService.notification(this.msgs, data);

                if (data.codigo == 1) {
                    this.cargarinformacionEmpelado(this.empleado.idEmpleado);
                    this.navegarDatosPersonalesEmpleado(data);
                }
                this.showLoading  = false;
            },
            error => {
                this.showLoading  = false;
                this.backendService.notification(this.msgs, error);
            }
        );

    }

    navegarDatosPersonalesEmpleado(data:NotificacionResult){
     //   this.state.tabs.tabdatosPersonales=='tab-active-1';
    }

    //calculo tiempo en letras
    private duration(fechaInicio:Date, fechaFin:Date) {

        let years:number=0;
        let months:number=0;
        let days:number=0;


        if (fechaInicio >= fechaFin) {
            this.tiempoTrabajado = undefined;
            return;
        }

        fechaFin.setHours(0);
        fechaFin.setMinutes(0);
        fechaFin.setSeconds(0);

        //anios
        if(fechaFin.getFullYear() > fechaInicio.getFullYear()){
            years = (fechaFin.getFullYear() - fechaInicio.getFullYear());
        }

        if(fechaInicio.getMonth() == fechaFin.getMonth()){
            if(fechaInicio.getDate()> fechaFin.getDate()){
                years = years - 1;
            }
        }

        if(fechaInicio.getMonth() > fechaFin.getMonth()){
            years = (years - 1);
        }

        //Meses

        if(fechaInicio.getFullYear() == fechaFin.getFullYear()) {
            if(fechaFin.getMonth() > fechaInicio.getMonth()){
                months = fechaFin.getMonth() - fechaInicio.getMonth();
                if(fechaFin.getDate() < fechaInicio.getDate()){
                    months = months -1;
                }

            }
        }else{

            if(fechaFin.getMonth() > fechaInicio.getMonth()){
                months = fechaFin.getMonth() - fechaInicio.getMonth();
            }else if(fechaFin.getMonth() == fechaInicio.getMonth()){
                if(fechaFin.getDate() >= fechaInicio.getDate()){
                    months = fechaFin.getMonth() - fechaInicio.getMonth();
                }else {
                    months = 11;
                }
            }else {
                months = 12 - fechaInicio.getMonth() + fechaFin.getMonth();
                if(fechaFin.getDate() < fechaInicio.getDate()){
                    months = months -1;
                }
            }
        }

        //dias
        if(fechaFin.getMonth() == fechaInicio.getMonth()){
            if(fechaFin.getDate() > fechaInicio.getDate()){
                days = fechaFin.getDate() - fechaInicio.getDate();
            }

        }else if(fechaFin.getDate() < fechaInicio.getDate()){
            let fechaCal:Date= new Date(fechaInicio.getFullYear(),fechaInicio.getMonth(),fechaInicio.getDate());
            fechaCal.setMonth(fechaCal.getMonth() + months);
            fechaCal.setDate(fechaCal.getDate()+1);

            //if(fechaFin.getDate() < fechaInicio.getDate()) {

            let interval = fechaFin.getTime() - fechaCal.getTime();
            days = interval / (1000 * 60 * 60 * 24);
            //}
        }else{
            days = fechaFin.getDate() - fechaInicio.getDate();
        }

        let duracion:string='';
        let concat:string='';



        if(years == 1){
            duracion = years+' a\u00f1o ';
        }else if(years > 1){
            duracion = years+' a\u00f1os ';
        }

        if(months == 1){
            duracion = duracion+months+' mes ';
        }else if(months > 1){
            duracion = duracion+months+' meses ';
        }

        if(days == 1){
            duracion = duracion + parseInt(days.toString()) + ' d\u00EDa';
        }else if(days > 1){
            duracion = duracion + parseInt(days.toString()) + ' d\u00EDas';
        }

        this.tiempoTrabajado = duracion;

    }

    inicializarTab(tabActive:string){
        if (tabActive!=null && tabActive !='') {

            if(tabActive == 'tab1') {
                this.classTab[1].tabSelected = 'active';
                this.classTab[1].tabContentSelected = 'tab-pane active';
            }
            else if(tabActive == 'tab2') {
                this.classTab[2].tabSelected = 'active';
                this.classTab[2].tabContentSelected = 'tab-pane active';
            }
            else if(tabActive == 'tab3') {
                this.classTab[3].tabSelected = 'active';
                this.classTab[3].tabContentSelected = 'tab-pane active';
            }
            else if(tabActive == 'tab4') {
                this.classTab[4].tabSelected = 'active';
                this.classTab[4].tabContentSelected = 'tab-pane active';
            }
            else{
                this.classTab[0].tabSelected = 'active';
                this.classTab[0].tabContentSelected = 'tab-pane active';
            }

        }else{
            this.classTab[0].tabSelected = 'active';
            this.classTab[0].tabContentSelected = 'tab-pane active';
        }
    }

}
