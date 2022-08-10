import { Role } from "./role";

export class User {
    id: number;
    identificacion: string;
    nombreCompleto: string;
    email: string;
    numeroTelefono: string;
    estado: string;
    password: string;
    token: string;
    idRol: string;
    
    // no mapp
    empresa: number;
    esAdmin: boolean;
}
