export class ActividadEconomica {
    // -- identificador único autoincremental
    id: number;
    codigoCompania: number;

    descripcion: string;
    valorRiesgo: number;
    
    estado: string;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}