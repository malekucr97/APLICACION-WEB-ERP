export class MacTipoIngreso {

    id: number;
    CodigoTipoIngreso: string;
    codigoCompania: number;

    descripcion: string;
    AplicaDeduccionesLey: boolean;
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}