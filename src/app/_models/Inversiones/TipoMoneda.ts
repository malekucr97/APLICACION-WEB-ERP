export class InvTipoMoneda {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    
                    public codigoMoneda:string, 
                    public codigoCompania:number, 

                    public descripcion:string,
                    public simbolo:string,
                    public valorRiesgo:number,
                    public estado:boolean

                    ) {
        }
    }