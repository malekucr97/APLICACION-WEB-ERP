export class Compania {
    // -- identificador unico autoincremental
    id: number;

    nombre: string;
    tipoIdentificacion: string;
    cedulaJuridica: string;
    descripcionCompania: string;
    correoElectronico: string;

    codigoPaisUbicacion: string;
    provincia: string;
    canton: string;
    distrito: string;
    barrio: string;
    detalleDireccion: string;
    codigoTelefono: string;
    telefon: string;

    claveCorreo: string;
    hostCorreo: string;
    puertoCorreo: string;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}