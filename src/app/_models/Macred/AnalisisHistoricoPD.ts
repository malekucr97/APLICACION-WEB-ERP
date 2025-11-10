export class AnalisisHistoricoPD {
  pdhCodAnalisisPd?: number;

  codAnalisis: number;
  codPersona: number;
  identificacion: string;

  codModeloPd: number;
  codGrupoPd: number;

  idCreditoPersona?: number

  datoHabitacasa: number;
  datoProvincia?: number;
  
  pdhAnalisisDefinitivo: boolean;
  pdhEstado: boolean;

  edadAsociado: number;
  cantidadHijos: number;
  anosLaborales: number;
  salarioBruto: number;

  atrasoMaximo: number;
  nCreditosVigentes: number;
  saldoTotal: number;

  codGenero: number;
  codEstadoCivil: number;
  codCondicionLaboral: number;

  pdhDZscore?: number;
  pdhDPdFinal?: number;

  usuarioCreacion?: string;
  fechaCreacion?: Date;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
}