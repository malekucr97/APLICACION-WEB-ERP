export class InvPersona {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number, 
                    public idTipoPersona:number, 

                    public identificacion:string,
                    public nombre:string,
                    public alias1:string,
                    public alias2:string,
                    public correo:string,
                    public telefono:string,

                    public estado:boolean

                    ) {
        }
    }