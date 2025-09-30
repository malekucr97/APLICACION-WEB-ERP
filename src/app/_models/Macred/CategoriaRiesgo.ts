export class CategoriaRiesgo {

    public id:number;
    public usuarioCreacion:string;
    public fechaCreacion:Date;
    public usuarioModificacion:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,

                public codigoCategoria:string,
                public descripcion:string,
                public porcentajeEstimacion:number,
                public numMesesCastigo:number,
                public porcentajeValorAjustado:number,
                public estado: boolean) {}
}
