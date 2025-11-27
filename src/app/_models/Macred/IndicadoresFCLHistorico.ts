export class IndicadoresFCLHistorico {

  scnafclhCodAnalisis!: number;

  codAnalisis!: number;

  idCompania!: number;

  codPersona!: number;

  identificacion!: string;

  codModelo!: number;

  codEscenario!: number;

  scnafclhPeso!: number;

  scnafclhCodIndicador!: number;

  scnafclhDescripcionIndicadores!: string;

  scnafclhCpd!: number;

  scnafclhScpd!: number;

  scnafclhNivelRiesgo!: number;

  scnafclhPonderacion!: number;

  scnafclhEstado!: boolean;

  usuarioCreacion!: string;

  fechaCreacion!: Date;

  usuarioModificacion!: string;

  fechaModificacion!: Date | null;

  // desc
  descRiesgoAsignado?: string;
}
