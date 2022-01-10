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
    telefono: string;

    claveCorreo: string;
    hostCorreo: string;
    puertoCorreo: string;

    adicionadoPor: string;
    fechaAdicion: string;
    modificadoPor: string;
    fechaModificacion: string;
}

export class CompaniaUsuario {
    IdUsuario: number;
    IdentificacionUsuario: string;
    IdEmpresa: number;
}