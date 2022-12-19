export class MacMatrizAceptacionIngreso {

    id: number;
    codigoMatriz : string;
    codigoCompania: number;

    descripcion : string;

    rangoDesviacion1: number;
    rangoDesviacion2: number;
    factor: number;

    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}