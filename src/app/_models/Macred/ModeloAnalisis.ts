// export class MacModeloAnalisis {
//     id: number;
//     codigoCompania: number;
    
//     codigoModelo: string;
//     descripcion: string;
//     estado: boolean;

//     adicionadoPor: string;
//     fechaAdicion: Date;
//     modificadoPor: string;
//     fechaModificacion: Date;
// }

export class MacModeloAnalisis {
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

export class MacGrupoModeloAnalisis {
    id: number;

    idModeloAnalisis: number;
    
    descripcion: string;
    peso:number; 
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}

export class MacIndicadorGrupoModeloAnalisis {
    id: number;

    idIndicador: number;
    idGrupoModeloAnalisis: number;
    
    descripcion: string;
    peso:number;
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}