export class PonderacionRiesgo {

    public id:number;
    public usuarioCreacion:string;
    public fechaCreacion:Date;
    public usuarioModificacion:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,

                public descripcion:string,
                public generador:number,
                public noGenerador:number,
                public ltvDesde:number,
                public ltvHasta:number,
                public estado: boolean) {}
}
