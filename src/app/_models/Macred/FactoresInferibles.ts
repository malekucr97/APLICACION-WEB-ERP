export class FactoresInferibles {

    public id:number;
    public usuarioCreacion:string;
    public fechaCreacion:Date;
    public usuarioModificacion:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,

                public descripcion:string,
                public valorMinimo:number,
                public valorMaximo:number,
                public quintilUno:number,
                public quintilDos:number,
                public quintilTres:number,
                public quintilCuatro:number,
                public quintilCinco:number,
                public estado: boolean) {}
}
