/**
 * Created by javier.cuicapuza on 12/6/2016.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorageGlobal = (function () {
    function LocalStorageGlobal(idEmpleado, idUsuario, rolName, mostrarBoton, mostrarBotonEmple, mostrarBotonRhna, mostrarBotonGeren, mostrarBotonAdmin, typeWrite, typeRead) {
        this.idEmpleado = idEmpleado;
        this.idUsuario = idUsuario;
        this.rolName = rolName;
        this.mostrarBoton = mostrarBoton;
        this.mostrarBotonEmple = mostrarBotonEmple;
        this.mostrarBotonRhna = mostrarBotonRhna;
        this.mostrarBotonGeren = mostrarBotonGeren;
        this.mostrarBotonAdmin = mostrarBotonAdmin;
        this.typeWrite = typeWrite;
        this.typeRead = typeRead;
    }
    return LocalStorageGlobal;
}());
exports.LocalStorageGlobal = LocalStorageGlobal;
