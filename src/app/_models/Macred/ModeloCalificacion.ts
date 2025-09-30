export class MacModeloCalificacion {
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
export class MacGrupoModeloCalificacion {
    id: number;
    idCompania: number;
    idModulo: number;

    idModeloCalificacion: number;
    
    descripcion: string;
    peso:number; 
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}

export class MacIndicadorGrupoModeloCalificacion {
    id: number;
    idCompania: number;
    idModulo: number;

    idGrupoModeloCalificacion: number;
    
    descripcion: string;
    peso:number;
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}