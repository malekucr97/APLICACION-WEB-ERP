export class VariablesPD {
  id: number;
  codigoCompania: number;
  descripcionVariable: string;
  valorCoeficiente: number;
  codCampoEquivalente?: string;
  estado: boolean;
  usuarioCreacion: string;
  fechaCreacion: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}
