export class AdminPlan {

    public id:number;

    public nombre:string;
    public tipo:string;
    
    public maximoAdministradores:number;
    public maximoFuncionales:number;

    public precioMensual:number;
    public precioAnual:number;

    public soporte:boolean;
    public porcentajeSoporteXUsuario:boolean;

    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(public pnombre:string,
                public ptipo:string,
                    
                public pmaximoAdministradores:number,
                public pmaximoFuncionales:number,

                public pprecioMensual:number,
                public pprecioAnual:number,

                public psoporte:boolean,
                public pporcentajeSoporteXUsuario:boolean,

                public padicionadoPor:string,
                public pfechaAdicion:Date) {

        this.nombre = pnombre;
        this.tipo = ptipo;
        this.maximoAdministradores = pmaximoAdministradores;
        this.maximoFuncionales = pmaximoFuncionales;
        this.precioMensual = pprecioMensual;
        this.precioAnual = pprecioAnual;
        this.soporte = psoporte;
        this.porcentajeSoporteXUsuario = pporcentajeSoporteXUsuario;

        this.adicionadoPor = padicionadoPor;
        this.fechaAdicion = pfechaAdicion;
    }
}

export class AdminTipoPlan {

    public id:number;
    public nombre:string;
    
    constructor(p_id:number, p_nombre:string) { this.id = p_id; this.nombre = p_nombre }
}

export class AdminPlanSupport {

    public id:number;
    public nombre:string;
    
    constructor(p_id:number, p_nombre:string) { this.id = p_id; this.nombre = p_nombre }
}