export class InvTipoPersona {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number, 

                    public descripcion:string,

                    public mascaraIdentificacion:string,
                    public estado:boolean

                    ) {
        }
    }