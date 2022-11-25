export class MacPersona {
    id: number;
    codigoCompania: number;
    
    identificacion: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    codigoGenero: number;
    fechaNacimiento: Date;
    codigoTipoPersona: number;
    codigoEstadoCivil: number;
    codigoCondicionLaboral: number;
    codigoCategoriaCredito: number;
    cantidadHijos: number;
    edad: number;

    indAsociado: boolean;
    codigoTipoAsociado: string;
    tiempoAfiliacion: number;

    codExterno: string;
    codigoPerfilCoop: number;
    cantidadCreditosHistorico: number;
    cPH: number;
    cPHUltimos12Meses: number;
    cPHUltimos24Meses: number;
    cantidadFianzas: number;
    totalSaldoFianzas: number;
    totalCuotasFianzas: number;
    atrasoMaximo: number;
    diasAtrasoCorte: number;
    atrasosUltimos12Meses: number;
    atrasosUltimos24Meses: number;
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
    datoHabitaCasa: number;
    datoProvincia: number;
    perMediosPago: number;
    perSegmentoAsociado: number;
    perMontoAprobado: number;
    perEndeudamientoTotal: number;
    perAnioAfiliacion: number;
    vCoeficiente: number;
    codigoTipoGarantia: number;

    constante: number;
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}
