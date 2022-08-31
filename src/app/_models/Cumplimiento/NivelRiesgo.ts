export class NivelRiesgo {
    // -- identificador único autoincremental
    id: number;
    codigoCompania: number;

    codigoNivel: number;
    descripcion: string;
    minimo: number;
    maximo: number;
    codigoSugef: number;
    
    estado: string;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}