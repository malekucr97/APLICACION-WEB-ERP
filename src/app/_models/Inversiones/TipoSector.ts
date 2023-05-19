export class InvTipoSector {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,
                    public codigoSector:string,
                    public descripcion:string,

                    public estado:boolean

                    ) {
        }
    }