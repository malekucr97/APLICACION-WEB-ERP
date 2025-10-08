export class MacNivelRiesgo {
    id: number;
    idCompania: number;
    idModulo: number;

    descripcion: string;
    
    rangoInicial: number;
    rangoFinal: number;
    puntaje: number;

    tieneScore: boolean;
    estado: boolean;
    
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}
