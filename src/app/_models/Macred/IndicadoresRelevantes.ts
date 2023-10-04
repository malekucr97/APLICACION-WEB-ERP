export interface MacIndicadoresRelevantes {
  codigoCompania: number;
  codIndicador: number;
  descripcion: string;
  estado: boolean;
  usuarioCreacion: string;
  fechaCreacion: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
