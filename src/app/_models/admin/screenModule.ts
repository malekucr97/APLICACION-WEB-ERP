export class ScreenModule {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idModulo: number,
                public codigo:string,
                public nombre: string,
                public estado: string) {}
}