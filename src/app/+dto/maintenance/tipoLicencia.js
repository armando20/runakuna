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
var TipoLicencia = (function (_super) {
    __extends(TipoLicencia, _super);
    function TipoLicencia(idTipoLicencia, codigo, nombre, limiteMensual, limiteAnual, estado, activaParaESS, visibleEmpleado, considerarLicenciaAlEnviar, eliminable) {
        if (activaParaESS === void 0) { activaParaESS = false; }
        if (visibleEmpleado === void 0) { visibleEmpleado = false; }
        if (considerarLicenciaAlEnviar === void 0) { considerarLicenciaAlEnviar = false; }
        if (eliminable === void 0) { eliminable = false; }
        var _this = _super.call(this) || this;
        _this.idTipoLicencia = idTipoLicencia;
        _this.codigo = codigo;
        _this.nombre = nombre;
        _this.limiteMensual = limiteMensual;
        _this.limiteAnual = limiteAnual;
        _this.estado = estado;
        _this.activaParaESS = activaParaESS;
        _this.visibleEmpleado = visibleEmpleado;
        _this.considerarLicenciaAlEnviar = considerarLicenciaAlEnviar;
        _this.eliminable = eliminable;
        return _this;
    }
    return TipoLicencia;
}(auditingEntity_1.AuditingEntity));
exports.TipoLicencia = TipoLicencia;
