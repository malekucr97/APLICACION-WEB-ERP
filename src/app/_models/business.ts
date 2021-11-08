import { Module } from "./module";

export class Business {
    id: string;
    nombre: string;
    cedulaJuridica: string;

    listModules: Module[];
}
export class BusinessUser {
    IdUsuario: number;
    IdentificacionUsuario: string;
    IdEmpresa: string;
}
