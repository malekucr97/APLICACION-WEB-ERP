export class MacAnalisisCapacidadPago {

    codigoCompania       :number;

    codigoPersona        : number;
    
    fechaAnalisis        : Date;
    estado               : boolean;
    analisisDefinitivo   : boolean;
    codigoNivelCapPago   : number;
    puntajeAnalisis      : number;
    calificacionCic      : string;
    puntajeFinalCic      : number;

    // --
    codModeloAnalisis       : number; // modelo de analisis
    codigoModeloAnalisis    : number; // calificacion
    // --

    codigoTipoIngresoAnalisis   : number;
    codigoTipoFormaPagoAnalisis : number;
    
    codigoMoneda            : number;
    codigoTipoGenerador     : number;
    indicadorCsd            : number;
    descPondLvt             : string;
    numeroDependientes      : number;
    observaciones           : string;
    ancapCapacidadPago      : number;
    ancapCalificacionFinal  : number;
    ancapPuntajeFinal       : number;
    
    totalMontoAnalisis      : number;
    totalIngresoBruto       : number;
    totalIngresoNeto        : number;
    totalCargaImpuestos     : number;
    totalExtrasAplicables   : number;
    totalDeducciones        : number;
    
    codigoAnalisis : number;
    codModeloSc : number;
    
    tipoIngreso : string;
    formaPago : string;

    adicionadoPor       : string;
    fechaAdicion        : Date
    modificadoPor       : string;
    fechaModificacion   : Date

    // desc
    descModeloAnalisis : string;
}