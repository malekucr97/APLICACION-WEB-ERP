export class InvPlazoInversion {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,

                    public descripcion:string,

                    public minimo:number,
                    public maximo:number,

                    public estado:boolean

                    ) {
        }
    }