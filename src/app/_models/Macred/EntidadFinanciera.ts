export class EntidadFinanciera {

    public id:number;
    public usuarioCreacion:string;
    public fechaCreacion:Date;
    public usuarioModificacion:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,

                public identificacion:string,
                public descripcion:string,
                public aliasCic:string,
                public estado: boolean) {}
}
