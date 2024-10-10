export class AdminPlanXBusiness {

    public id:number;

    public idPlan:number;
    public idBusiness:number;
    
    public cantidadAdministradores:number;
    public cantidadFuncionales:number;

    public adicionadoPor:string;
    public fechaAdicion:Date;
    public modificadoPor:string;
    public fechaModificacion:Date;
    
    constructor(public pidPlan:number,
                public pidBusiness:number,
                
                public pcantAdministradores:number,
                public pcantFuncionales:number,

                public padicionadoPor:string,
                public pfechaAdicion:Date) {

        this.idPlan = pidPlan;
        this.idBusiness = pidBusiness;
        this.cantidadAdministradores = pcantAdministradores;
        this.cantidadFuncionales = pcantFuncionales;

        this.adicionadoPor = padicionadoPor;
        this.fechaAdicion = pfechaAdicion;
    }
}