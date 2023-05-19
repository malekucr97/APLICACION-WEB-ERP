export class InvMontoMaximoPersona {

    public id:number;
    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(    public codigoCompania:number, 
                    public idPersona:number, 
                    public idMoneda:number, 

                    public maximoInversiones:number,
                    public maximoFondos:number

                    ) {
        }
    }