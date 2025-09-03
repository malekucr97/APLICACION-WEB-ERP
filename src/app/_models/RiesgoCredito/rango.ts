export class Rango {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,
                // --
                public descripcion:string,
                public inicio: number,
                public fin: number,
                public porcentajeEstimacion: number,
                public nivel: number,
                public identificador:string) {}
}

export class Identificador { public identificador:string; }