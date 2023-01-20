export class MacTipoIngreso {

    id: number;
    codigoTipoIngreso: string;
    codigoCompania: number;

    descripcion: string;
    aplicaDeduccionesLey: boolean;
    estado: boolean;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}