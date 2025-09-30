export class TipoLineaCredito {

    public id:number;
    public usuarioCreacion:string;
    public fechaCreacion:Date;
    public usuarioModificacion:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,

                public nomLineaCredito:string,
                public tasaInteres:number,
                public codigoActividadSugef:number,
                public estado: boolean) {}
}
