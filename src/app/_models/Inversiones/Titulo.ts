export class InvTitulo {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,
                    public codigoTitulo:string,
                    public descripcion:string,
                    public tasaImpuestoRenta:number,

                    public idTasa:number,
                    public idClase:number,
                    public idPlazo:number,
                    public idMercado:number,
                    public idSector:number,
                    public idEmisor:number,
                    public idMoneda:number,

                    public calculaIntereses:boolean,
                    public calculaImpuestos:boolean,
                    public calculaCupones:boolean,

                    public estado:boolean

                    ) {
        }
    }