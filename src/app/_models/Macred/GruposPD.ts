export interface GruposPD {
  idGrupoPd: number;
  codModeloPd: number;
  descripcion: string;
  estado: boolean;
  usuarioCreacion: string;
  fechaCreacion: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
