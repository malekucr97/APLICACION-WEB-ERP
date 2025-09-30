export interface TipoActividadEconomica {
  codActividadEconomica: number,
  codigoCompania: number,
  descripcion: string,
  estado: boolean,
  usuarioCreacion: string,
  fechaCreacion: Date,
  usuarioModificacion?: string,
  fechaModificacion?: Date
}