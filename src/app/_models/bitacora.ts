export class Bitacora {

    public id:number;

    constructor(    public codigoInterno:string,

                    public sesion:boolean,
                    public consulta:boolean,

                    public idCompania:number,
                    public idModulo:number,
                    public idUsuario:number,

                    public descripcion:string,
                    public contadorSesion:number,

                    public fechaSesion:Date,

                    public lugarSesion:string,
                    public token:string,
                    public urlConsulta:string
                    ) {
        }
    }