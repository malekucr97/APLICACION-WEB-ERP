export class InvClaseInversion {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,
                    public codigoClase:string,
                    public descripcion:string,

                    public estado:boolean

                    ) {
        }
    }