export class Role {
    id: string;
    nombre: string;
    esAdministrador: number;
    descripcion: string;
    // columns roleBusiness
    estado: string;
    tipo: string;
}

export class RolModuleBusiness {
    idRol: string;
    idModulo: number;
    idBusiness: number;
    estado: string;
}

export class AssignRoleObject{
    idRole: string;
    idUser: string;
}

export class UpdateRolModel {
    idRol: string;
    idBusiness: number;
    estado: string;
    tipo: string;
}
