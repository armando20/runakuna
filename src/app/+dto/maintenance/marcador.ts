import {AuditingEntity} from "../auditingEntity";
export class Marcador extends AuditingEntity {
    constructor(
        public idMarcador?: number,
        public codigo?: string,
        public nombre?: string,
        public descripcion?: string,
        public idEmpresa?: number
    ){
        super();
    }
}