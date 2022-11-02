export class CanalDistribucion
 {
    // -- identificador único autoincremental
    id: number;
    codigoCompania: number;

    descripcion: string;
    porcentaje: number;
    
    estado: string;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}