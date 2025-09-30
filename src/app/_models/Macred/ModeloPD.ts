export class MacModeloPD {
    id: number;
    idCompania: number;
    idModulo: number;
    
    descripcion: string;
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}
export class MacGrupoModeloPD {
    id: number;
    idCompania: number;
    idModulo: number;

    idModeloPD: number;
    
    descripcion: string;
    peso:number; 
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}

export class MacIndicadorGrupoModeloPD {
    id: number;
    idCompania: number;
    idModulo: number;

    idGrupoModeloPD: number;
    
    idVariablePD: number;

    descripcion: string;
    peso:number;
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}