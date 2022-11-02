export class MovimientoHaberRiesgo {
    // -- identificador único autoincremental
    id: number;
    codigoCompania: number;

    descripcion: string;
    montoInferior: number;
    montoSuperior: number;
    valorRiesgo: number;
    
    estado: string;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}