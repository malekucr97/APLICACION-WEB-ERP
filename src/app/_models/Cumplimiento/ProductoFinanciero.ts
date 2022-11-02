export class ProductoFinanciero {
    // -- identificador único autoincremental
    id: number;
    codigoCompania: number;

    codigoProducto: string;
    descripcion: string;
    porcentaje: number;
    
    estado: string;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}