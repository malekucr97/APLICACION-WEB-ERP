export class InvTitulo {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,
                    public codigoTitulo:string,
                    public descripcion:string,
                    public porcentajeInteres:number,

                    public estado:boolean

                    ) {
        }
    }