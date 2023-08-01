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
  estadoSSL: boolean;

  adicionadoPor: string;
  fechaAdicion: Date;
  modificadoPor: string;
  fechaModificacion: Date;
  mantenimientoReportes: boolean;
  cuentaCorreoDefecto: boolean;
  tamanoModuloDefecto: boolean;
}

export class CompaniaUsuario {
  IdUsuario: number;
  IdentificacionUsuario: string;
  IdEmpresa: number;
}
