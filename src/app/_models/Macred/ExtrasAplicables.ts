export class MacExtrasAplicables {

    id: number;
    codigoCompania: number;
    codigoAnalisis: number;
    codigoIngreso: number;
    
    montoExtras: number;
    desviacionEstandar: number;
    coeficienteVarianza: number;
    porcentajeExtrasAplicables: number;
    promedioExtrasAplicables: number;

    adicionadoPor: string;
    fechaAdicion: Date;
    modificadoPor: string;
    fechaModificacion: Date;

    // display info
    sumatoriaExtras : number;
}

export class MacListaExtras {

    id?: number;
    idExtras: number;
    
    monto: number;
    desviacion: number;
    coeficiente: number;
    porcentaje: number;
    promedio: number;
}