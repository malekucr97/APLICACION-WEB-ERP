export class TipoMoneda {

    public id:number;
    public usuarioCreacion:string;
    public fechaCreacion:Date;
    public usuarioModificacion:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,

                public descripcion:string,
                public simbolo:string,
                public alias:string,
                public estado: boolean) {}
}
