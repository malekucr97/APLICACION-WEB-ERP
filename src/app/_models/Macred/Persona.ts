export class MacPersona {
    id: number;
    codigoCompania: number;

    identificacion: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    codigoEstadoCivil: number;
    codigoTipoPersona: number;
    codigoGenero: number;
    codigoCondicionLaboral: number;
    codigoTipoHabitacion: number;
    cantidadHijos: number;
    fechaNacimiento: Date;
    edad: number;
    indAsociado: boolean;
    estado: boolean;

    // descripciones
    descEstadoCivil?: string;
    descCondicionLaboral?: string;
    descTipoHabitacion?: string;


    // informacion credito
    codigoCategoriaCredito: number;
    codigoTipoAsociado: string;
    cantidadFianzas: number;
    tiempoAfiliacion: number;
    cantidadCreditosHistorico: number;
    totalSaldoFianzas: number;
    totalCuotasFianzas: number;
    cph: number;
    cphUltimos12Meses: number;
    cphUltimos24Meses: number;
    atrasoMaximo: number;
    atrasosUltimos12Meses: number;
    atrasosUltimos24Meses: number;
    diasAtrasoCorte: number;
    //

    codigoTipoGarantia: number;
    codExterno: string;
    codigoPerfilCoop: number;
    montoAprobadoTotal: number;
    saldoTotal: number;
    saldoCuotas: number;
    salarioBruto: number;
    totalDeducciones: number;
    totalSalarioNeto: number;
    plazoMaximo: number;
    tasaMaxima: number;
    aniosLaborales: number;
    nHistoricoCreditos: number;
    nCreditosVigentes: number;
    datoProvincia: number;
    perMediosPago: number;
    perSegmentoAsociado: number;
    perMontoAprobado: number;
    perEndeudamientoTotal: number;
    perAnioAfiliacion: number;
    vCoeficiente: number;
    constante: number;
    
    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;

    // pd temp
    codModeloPD?: number;
    codGrupoModeloPD?: number;

    pdCsd?: number;
    pdTienePropiedad?: boolean;
    pdTieneVehiculo?: boolean;
}

export class MacInformacionCreditoPersona {
    id: number;
    idCompania: number;
    idModulo: number;

    idPersona: number;

    codigoCategoriaCredito: number;
    codigoTipoAsociado: number;
    
    cantidadFianzas: number;
    tiempoAfiliacion: number;
    cantidadCreditosHistorico: number;
    totalSaldoFianzas: number;
    totalCuotasFianzas: number;
    cph: number;
    cphUltimos12Meses: number;
    cphUltimos24Meses: number;
    atrasoMaximo: number;
    atrasosUltimos12Meses: number;
    atrasosUltimos24Meses: number;
    diasAtrasoCorte: number;

    estado: boolean;

    adicionadoPor: string
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;

    // Descripciones
    descCategoriaCredito?: string;
    descTipoAsociado?: string;
}