export interface ArchivoCarga {
  Id: number;
  IdCompania: number;
  IdModulo: number;
  IdUsuario: number;
  NombreArchivo: string;
  RutaArchivo?: string;
  EstadoCarga: boolean;
  FechaCarga: Date;
}

export interface HojasExcel {
  nombreMostrar: string;
  nombreOriginal: string;
}
