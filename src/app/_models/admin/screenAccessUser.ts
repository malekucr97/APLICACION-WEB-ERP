export class ScreenAccessUser {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;

    constructor(public idCompania:number,
                public idUsuario:number,
                public idPantalla:number,
                public estado: boolean) {}
}
