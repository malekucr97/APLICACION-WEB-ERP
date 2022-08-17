export class Role {
    id: string;
    nombre: string;
    esAdministrador: number;
    descripcion: string;
    estado: string;
    tipo: string;
}

export class ModuleRolBusiness{
    IdRol: string;
    IdModulo: number;
    IdBusiness: number;
    Estado: string;
}

export class AssignRoleObject{
    idRole: string;
    idUser: string;
}
