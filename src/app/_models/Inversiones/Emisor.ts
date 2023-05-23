export class InvEmisor {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number,

                    public idTipoPersona:number,
                    public idTipoSector:number,

                    public codigoEmisor:string,
                    public descripcion:string,

                    public identificacion:string,
                    public otrasResenas:string,

                    public estado:boolean

                    ) {
        }
    }