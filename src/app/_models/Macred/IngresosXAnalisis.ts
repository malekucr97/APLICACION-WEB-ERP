export class MacIngresosXAnalisis {

    id: number;
    codigoCompania: number;
    
    codigoTipoIngreso: number;
    codigoAnalisis: number;
    codigoTipoMoneda: number;

    montoBruto: number;
    montoExtras: number;
    porcentajeExtras: number;
    cargasSociales: number;
    impuestoRenta: number;
    montoNeto: number;
    montoDeducciones: number;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}