"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by javier.cuicapuza on 1/16/2017.
 */
var StorageResult = (function () {
    function StorageResult(unidadDeNegocio, departamentoArea, proyecto, tablaGeneral, tipoLicencia, moneda, cargo) {
        if (unidadDeNegocio === void 0) { unidadDeNegocio = []; }
        if (departamentoArea === void 0) { departamentoArea = []; }
        if (proyecto === void 0) { proyecto = []; }
        if (tablaGeneral === void 0) { tablaGeneral = []; }
        if (tipoLicencia === void 0) { tipoLicencia = []; }
        if (moneda === void 0) { moneda = []; }
        if (cargo === void 0) { cargo = []; }
        this.unidadDeNegocio = unidadDeNegocio;
        this.departamentoArea = departamentoArea;
        this.proyecto = proyecto;
        this.tablaGeneral = tablaGeneral;
        this.tipoLicencia = tipoLicencia;
        this.moneda = moneda;
        this.cargo = cargo;
    }
    return StorageResult;
}());
exports.StorageResult = StorageResult;
