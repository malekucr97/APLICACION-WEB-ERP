export class ScoringHistorico {
    id!: number;
    idCompania!: number;
    codigoHistorico!: number;
    codigoAnalisis!: number;
    codigoModeloSc?: number;
    codigoPersona?: string;
    identificacion?: string;
    variable?: string;
    item?: string;
    limite1: number = 0;
    limite2: number = 0;
    limite3: number = 0;
    limite4: number = 0;
    peso: number = 0;
    pesoItem: number = 0;
    datoReal: number = 0;

    riesgoAsignado: number = 0;
    descRiesgoAsignado?: string;

    puntaje: number = 0;
    riesgoExtremo: number = 0;
    riesgoAlto: number = 0;
    riesgoModerado: number = 0;
    riesgoBajo: number = 0;
    estado?: boolean;
    rangoLimites!: string;
    tipoCalificacion!: string;
    puntajeFinal!: number;
    usuarioCreacion!: string;
    fechaCreacion!: Date;
    usuarioModificacion?: string;
    fechaModificacion?: Date;
}
