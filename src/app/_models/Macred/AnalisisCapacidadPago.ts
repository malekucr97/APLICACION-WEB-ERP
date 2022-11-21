export class MacAnalisisCapacidadPago {

    codigoAnalisis : number;

    codModeloAnalisis : number;
    codModeloSc : number;
    
    tipoIngreso : string;
    formaPago : string;
    
    modificadoPor : string;
    fechaModificacion : Date

    constructor(    public codigoCompania       :number,
                    public codigoPersona        : number,
                    public fechaAnalisis        : Date,
                    public estado               : boolean,
                    public analisisDefinitivo   : boolean,
                    public codigoNivelCapPago   : number,
                    public puntajeAnalisis      : number,
                    public calificacionCic      : string,
                    public puntajeFinalCic      : number,
                    public codigoTipoIngresoAnalisis   : number,
                    public codigoTipoFormaPagoAnalisis : number,
                    public codigoModeloAnalisis        : number,
                    public codigoMoneda            : number,
                    public codigoTipoGenerador     : number,
                    public indicadorCsd            : number,
                    public descPondLvt             : string,
                    public numeroDependientes      : number,
                    public observaciones           : string,
                    public ancapCapacidadPago      : number,
                    public ancapCalificacionFinal  : number,
                    public ancapPuntajeFinal       : number,
                    public adicionadoPor           : string,
                    public fechaAdicion            : Date
    ) { }
}