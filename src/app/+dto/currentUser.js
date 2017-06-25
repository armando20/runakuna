"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by javier.cuicapuza on 12/6/2016.
 */
var CurrentUser = (function () {
    function CurrentUser(idEmpleado, idUsuario, cuentaUsuario, nombreCompleto, email, idEmpresa, foto, genero, build, revision, timestamp, assignedRoles) {
        if (assignedRoles === void 0) { assignedRoles = []; }
        this.idEmpleado = idEmpleado;
        this.idUsuario = idUsuario;
        this.cuentaUsuario = cuentaUsuario;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.idEmpresa = idEmpresa;
        this.foto = foto;
        this.genero = genero;
        this.build = build;
        this.revision = revision;
        this.timestamp = timestamp;
        this.assignedRoles = assignedRoles;
    }
    return CurrentUser;
}());
exports.CurrentUser = CurrentUser;
