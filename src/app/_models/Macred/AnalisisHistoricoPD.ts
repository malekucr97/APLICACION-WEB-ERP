export interface AnalisisHistoricoPD {
  pdhCodAnalisisPd?: number;
  codAnalisis: number;
  codPersona: number;
  codModeloPd: number;
  codGrupoPd: number;
  datoHabitacasa: number;
  datoProvincia: number;
  fechaCreacion: Date;
  fechaModificacion?: Date;
  pdhAnalisisDefinitivo: boolean;
  pdhEstado: boolean;
  edadAsociado: number;
  cantidadHijos: number;
  anosLaborales: number;
  salarioBruto: number;
  atrasoMaximo: number;
  nCreditosVigentes: number;
  saldoTotal: number;
  pdhDZscore?: number;
  pdhDPdFinal?: number;
  identificacion: string;
  codGenero: number;
  codEstadoCivil: number;
  codCondicionLaboral: number;
  usuarioCreacion: string;
  usuarioModificacion?: string;
}
