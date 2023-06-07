import { GruposPD } from "./GruposPD";
import { VariablesPD } from "./VariablesPD";

export interface IndicadoresPorGrupoPD {
  codGrupoPd: number;
  codIndicadorPd: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuarioCreacion: string;
  usuarioModificacion: string;
  grupo?: GruposPD;
  indicador?:VariablesPD;
}
