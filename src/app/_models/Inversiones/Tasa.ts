export class InvTasa {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,
                    public codigoTasa:string,
                    public descripcion:string,

                    public tasa:number,

                    public porcentual:boolean,
                    public estado:boolean

                    ) {
        }
    }