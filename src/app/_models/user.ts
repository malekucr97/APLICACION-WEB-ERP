export class User {
    id: number;
    identificacion: string;
    nombreCompleto: string;
    email: string;
    numeroTelefono: string;
    estado: string;
    token: string;
    idRol: string;
    
    // no mapp
    password: string;
    empresa: number;
    esAdmin: boolean;

    // no login
    codeNoLogin : string;
    messageNoLogin : string;
}
