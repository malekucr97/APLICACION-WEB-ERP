export class InvPeriocidad {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number, 
                    public codigoPeriocidad:string, 

                    public descripcion:string,
                    public vecesxAnio:number,

                    public estado:boolean

                    ) {
        }
    }