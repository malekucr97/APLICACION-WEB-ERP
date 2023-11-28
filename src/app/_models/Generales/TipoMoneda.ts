export class GenTipoMoneda {

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
                    public bccrIndicadorCompra:number,
                    public bccrIndicadorVenta:number,
                    public estado:boolean

                    ) {
        }
    }