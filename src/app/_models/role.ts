export class Role {
    id: string;
    nombre: string;
    esAdministrador: number;
    descripcion: string;
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
