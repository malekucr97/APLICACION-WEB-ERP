export class CantidadHaberRiesgo {
    // -- identificador único autoincremental
    id: number;
    codigoCompania: number;

    descripcion: string;
    cantidadInferior: number;
    cantidadSuperior: number;
    valorRiesgo: number;
    
    estado: string;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}