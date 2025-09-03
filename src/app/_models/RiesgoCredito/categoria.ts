export class Categoria {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,
                // --
                public descripcion:string,
                public nivel: number,
                public estimacionCubierta:number,
                public estimacionDescubierta:number) {}
}
