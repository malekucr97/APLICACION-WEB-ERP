export class InvInversionEncabezado {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,
                    
                    public idTitulo:number,
                    public idMoneda:number,
                    public idPeriocidad:number,
                    public idAnio:number,
                    public idMercado:number,
                    public idSector:number,
                    public idPlazo:number,

                    public numeroInversion:string,
                    public numeroCuenta:string,
                    public certificadoBancario:string,

                    public fechaInversion:Date,
                    public fechaInicio:Date,
                    public fechaFinal:Date,

                    
                    public diasDiferencia:number,
                    public diasAcumulados:number,
                    
                    public calculaCupon:boolean,
                    public fechaUltimoCupon:Date,
                    public inversionNeta:number,
                    public vence:boolean,

                    public observaciones:string,

                    public estado:boolean,

                    public usuarioAprueba1:string,
                    public usuarioAprueba2:string,

                    ) {
        }
    }