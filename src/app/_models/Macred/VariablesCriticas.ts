export class MacVariablesCriticas {
  
  id: number;
  idCompania: number;
  idModulo: number;
  
  descripcion: string;
  estado: boolean;

  adicionadoPor: string;
  fechaAdicion: Date;
  modificadoPor?: string;
  fechaModificacion?: Date;
}

export class MacVariableCriticaXEscenario {
  
  id: number;

  idVariable : number;
  idEscenario : number;
  
  tipoEstres: string;
  valorEstres: number;

  descripcionVariable: string;
  descripcionTipoEstres: string;

  adicionadoPor: string;
  fechaAdicion: Date;
  modificadoPor?: string;
  fechaModificacion?: Date;
}
