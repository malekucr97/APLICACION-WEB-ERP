export class InvTipoCambio {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number, 
                    public idMoneda:number, 

                    public montoCompra:number,
                    public montoVenta:number,
                    public fechaConsulta:Date,

                    ) {
        }
    }