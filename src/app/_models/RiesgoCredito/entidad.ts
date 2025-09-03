export class Entidad {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,
                public nombre:string,
                public estado: boolean) {}
}
