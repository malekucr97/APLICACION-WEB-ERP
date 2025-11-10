export class Scoring {
    id: number;
    idAnalisis: number;

    idCompania: number;

    idModeloScoring: number;

    numeroAtrasoCoope : number;
    tiempoSolicitudes : number;
    variedadLineas : number;
    institucionesUtilizadas : number;
    diasAtrasoSistema : number;
    creditosActivosSistema : number;
    cic : number;
    aniosCreditoCoope : number;
    numeroRefinanciamientos : number;

    pd : number;
    puntaje : number;
    calificacion : string;

    adicionadoPor: string
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}

export class ScoringParametros {
    idPersona: string;
    IdentificacionPersona: string;
    CodModeloScoring: number;
    Estado: boolean;
    UsuarioCreacion : string;
    CodAnalisis : number;
    IdCompania : number;
}