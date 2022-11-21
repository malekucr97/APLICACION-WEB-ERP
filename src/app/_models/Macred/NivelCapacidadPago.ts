export class MacNivelCapacidadPago {
    id: number;
    codigoCompania: number;
    
    codigoNivel: string;
    descripcion: string;

    puntaje: number;
    rangoInicial: number;
    rangoFinal: number;

    tieneCapacidadPago: boolean;
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}