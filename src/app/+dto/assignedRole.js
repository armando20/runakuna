"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by javier.cuicapuza on 1/24/2017.
 */
var AssignedRole = (function () {
    function AssignedRole(roleName, roleDescription, assigned, roleDefault) {
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.assigned = assigned;
        this.roleDefault = roleDefault;
    }
    return AssignedRole;
}());
exports.AssignedRole = AssignedRole;
