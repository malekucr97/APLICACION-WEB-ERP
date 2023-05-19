export class InvTipoAnio {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,
                    public descripcion:string,
                    public dias:number,

                    public estado:boolean

                    ) {
        }
    }