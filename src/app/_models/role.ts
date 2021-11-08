export class Role {
    id: string;
    nombre: string;
    esAdministrador: number;
    descripcion: string;
    estado: string;
    tipo: string;
}

export class ModuleRol{
    IdRol: string;
    IdModulo: number;
}

export class AssignRoleObject{
    idRole: string;
    idUser: string;
}
