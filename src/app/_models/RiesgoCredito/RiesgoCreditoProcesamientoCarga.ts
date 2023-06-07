import { ArchivoCarga, HojasExcel } from "../modules/archivoCarga";

export interface RiesgoCreditoProcesamientoCarga {
  ArchivoCarga: ArchivoCarga,
  HojaExcel: HojasExcel,
  Mes: number,
  Anno: number
}
