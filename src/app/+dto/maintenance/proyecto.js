"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var auditingEntity_1 = require("../auditingEntity");
var Proyecto = (function (_super) {
    __extends(Proyecto, _super);
    function Proyecto(idProyecto, idUnidadDeNegocio, idDepartamentoArea, idJefeProyecto, codigo, nombre, descripcion, estado, idJefeProyectoReemplazo, jefeNoDisponible, cliente, fechaInicio, fechaFin, nombreJefeProyecto, nombreJefeProyectoReemplazo) {
        if (jefeNoDisponible === void 0) { jefeNoDisponible = false; }
        var _this = _super.call(this) || this;
        _this.idProyecto = idProyecto;
        _this.idUnidadDeNegocio = idUnidadDeNegocio;
        _this.idDepartamentoArea = idDepartamentoArea;
        _this.idJefeProyecto = idJefeProyecto;
        _this.codigo = codigo;
        _this.nombre = nombre;
        _this.descripcion = descripcion;
        _this.estado = estado;
        _this.idJefeProyectoReemplazo = idJefeProyectoReemplazo;
        _this.jefeNoDisponible = jefeNoDisponible;
        _this.cliente = cliente;
        _this.fechaInicio = fechaInicio;
        _this.fechaFin = fechaFin;
        _this.nombreJefeProyecto = nombreJefeProyecto;
        _this.nombreJefeProyectoReemplazo = nombreJefeProyectoReemplazo;
        return _this;
    }
    return Proyecto;
}(auditingEntity_1.AuditingEntity));
exports.Proyecto = Proyecto;
