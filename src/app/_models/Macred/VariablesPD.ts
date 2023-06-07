export interface VariablesPD {
  id: number;
  codigoCompania: number;
  descripcionVariable: string;
  valorCoeficiente: number;
  codCampoEquivalente?: string;
  usuarioCreacion: string;
  fechaCreacion: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
  estado: boolean;
}
