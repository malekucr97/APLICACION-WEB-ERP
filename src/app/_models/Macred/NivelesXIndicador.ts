export interface MacNivelesXIndicador {
  codigoCompania: number;
  codIndicador: number;
  codNivel: number;
  rangoInicial: number;
  rangoFinal: number;
  usuarioCreacion: string;
  fechaCreacion: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
