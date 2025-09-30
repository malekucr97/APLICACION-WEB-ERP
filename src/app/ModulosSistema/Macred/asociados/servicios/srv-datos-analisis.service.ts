import { Injectable } from '@angular/core';
import { Compania, Module, User } from '@app/_models';
import {
  MacAnalisisCapacidadPago,
  MacEstadoCivil,
  MacPersona,
  ModelosPD,
} from '@app/_models/Macred';
import { MacTipoGenero } from '@app/_models/Macred/TipoGenero';
import { MacTipoHabitacion } from '@app/_models/Macred/TipoHabitacion';
import { AccountService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SrvDatosAnalisisService {
  _analisisCapacidadpago: MacAnalisisCapacidadPago;
  _personaAnalisis: MacPersona;

  listTipoGenero: MacTipoGenero[];
  lstEstadoCivil: MacEstadoCivil[];
  listTipoHabitaciones: MacTipoHabitacion[];
  lstModelosPD: ModelosPD[] = [];

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private companiaObservable: Compania;
  // ## -- ----------------- -- ## //

  constructor(
    private macredService: MacredService,
    private accountService: AccountService
  ) {
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.companiaObservable = this.accountService.businessValue;
  }

  InicializarVariablesGenerales() {
    this.cargarDatosPD();
  }

  //#region ANALISIS CAPACIDAD PAGO

  procesoActualizarAnalisisCapacidadPago(
    nuevoAnalisisCapacidadPago: MacAnalisisCapacidadPago
  ) {
    return new Promise((resolve, reject) => {
      this.macredService
        .putAnalisisCapPago(nuevoAnalisisCapacidadPago)
        .pipe(first())
        .subscribe(
          (response) => {
            if (response) {
              resolve(response);
            } else {
              reject(`No fue posible actualizar el análisis.`);
            }
          },
          (error) => {
            reject(
              `Problemas al establecer la conexión con el servidor. Detalle: ${error}`
            );
          }
        );
    });
  }

  //#endregion

  //#region PD

  private cargarDatosPD() {
    this.macredService
      .getTiposGenerosCompania(this.companiaObservable.id)
      .pipe(first())
      .subscribe((response) => {
        this.listTipoGenero = response;
      });

    this.macredService
      .getEstadosCiviles()
      .pipe(first())
      .subscribe((response) => {
        this.lstEstadoCivil = response;
      });

    this.macredService
      .getTiposHabitacionesCompania(this.userObservable.empresa)
      .pipe(first())
      .subscribe((tipoHabitacionResponse) => {
        this.listTipoHabitaciones = tipoHabitacionResponse;
      });

    this.macredService
      .getPDModelos(this.userObservable.empresa)
      .pipe(first())
      .subscribe((lstModelosPD) => {
        this.lstModelosPD = lstModelosPD;
      });
  }

  //#endregion
}
