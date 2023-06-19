export class InvInversionDetalle {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,
                    
                    public idEncabezado:number,
                    public idEmisor:number,

                    public tasaInteresFacial:number,
                    public tasaInteresReal:number,
                    public interesInversion:number,
                    public interesNeto:number,
                    public interesDiario:number,
                    public impuestoRenta:number,
                    public cantidadCupones:number,
                    public montoCupones:number,

                    public observaciones:string,
                    public estado:boolean,

                    ) {
        }
    }