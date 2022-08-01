import * as internal from "events";

export class Module {
    id: number;
    identificador: string;
    idSociedad: number;
    nombre: string;
    descripcion: string;
    estado: string;

    pathIco: string;
}

export class ModulesProperties {
    id: string;
    nombre: string;
    pathIco: string;
    descripcion: string;

    urlRedirect: string;
}

export class MenuModule {
    id: number;
    idModulo:number;
    JSONMenu:string;
}