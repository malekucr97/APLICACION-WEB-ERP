import { Role } from "./role";

export class User {
    id: number;
    identificacion: string;
    nombreCompleto: string;
    email: string;
    numeroTelefono: string;
    estado: string;
    token: string;
    password: string;
    idRol: string;
    empresa: number;

    // no mapp
    esAdmin: boolean;
}
