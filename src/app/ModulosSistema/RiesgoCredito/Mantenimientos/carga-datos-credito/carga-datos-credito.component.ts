import { Component, OnInit } from '@angular/core';
import { ArchivoCarga, HojasExcel } from '@app/_models';
import { AccountService, AlertService, GeneralesService } from '@app/_services';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/es';
import { DateAdapter } from '@angular/material/core';
import { RiesgoCreditoProcesamientoCarga } from '@app/_models/RiesgoCredito/RiesgoCreditoProcesamientoCarga';
import { RiesgoCreditoService } from '@app/_services/riesgoCredito.service';

@Component({
  selector: 'app-carga-datos-credito',
  templateUrl: './carga-datos-credito.component.html',
  styleUrls: ['../../../../../assets/scss/tailwind.scss'],
})
export class CargaDatosCreditoComponent implements OnInit {
  _rutaArchivo: string = '';
  _archivo: any;
  _selectHojasExcelEstado: boolean = false;
  _lstArchivosCargados: ArchivoCarga[] = [];
  _archivoCargaSeleccionado: string = '';
  _lstHojasExcelDeArchivoSeleccionado: HojasExcel[] = [];
  _hojaExcelSeleccionada: string = '';
  _fechaMaximaDatePicker: Date = new Date();
  _fechaSeleccionada: {
    value: string;
    mes?: number;
    anno?: number;
  } = {
    value: '',
    mes: undefined,
    anno: undefined,
  };

  constructor(
    private dateAdapter: DateAdapter<any>,
    private alertService: AlertService,
    private accountService: AccountService,
    private generalesService: GeneralesService,
    private riesgoCreditoService: RiesgoCreditoService
  ) {
    this.dateAdapter.setLocale('es-CR');
    this.ObtenerListaDeArchivos();
  }

  ngOnInit(): void {}

  //#region METODOS - FUNCIONES

  ObtenerListaDeArchivos() {
    let oArchivoCarga = {
      IdModulo: this.accountService.moduleValue.id,
      IdCompania: this.accountService.businessValue.id,
    } as ArchivoCarga;
    this.generalesService.getCargasArchivosPorModulos(oArchivoCarga).subscribe(
      (lst) => {
        this._lstArchivosCargados = [...lst];
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  ObtenerListaDeHojasExcel(_idArchivoCarga) {
    let oArchivoCarga = {
      Id: _idArchivoCarga,
    } as ArchivoCarga;
    this.generalesService.getHojasExcel(oArchivoCarga).subscribe(
      (lst) => {
        this._lstHojasExcelDeArchivoSeleccionado = [...lst];
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  //#endregion

  //#region EVENTOS DE CONTROLES

  handleAbrirPicker(dp) {
    dp.open();
  }

  handleCerrarPicker(eventData: any, dp?: any) {
    if (!eventData) {
      return;
    }
    let momentFecha = moment(eventData);
    this._fechaSeleccionada.value = eventData;
    this._fechaSeleccionada.mes = momentFecha.month() + 1;
    this._fechaSeleccionada.anno = momentFecha.year();
    dp.close();
  }

  handleSelectArchivo(idArchivoSeleccionado) {
    if (!idArchivoSeleccionado) {
      this.alertService.error('Se debe seleciconar un archivo válido');
      return;
    }
    this._archivoCargaSeleccionado = idArchivoSeleccionado;
    this.ObtenerListaDeHojasExcel(idArchivoSeleccionado);
  }

  handleCambioCargaArchivo($event, file) {
    this._archivo = file;
  }

  handleSubmitCargaArchivo() {
    if (this._archivo.length === 0) {
      return;
    }

    const formData = new FormData();

    for (let file of this._archivo) formData.append(file.name, file);

    formData.append('IdUsuario', this.accountService.userValue.id.toString());
    formData.append(
      'IdentificacionUsuario',
      this.accountService.userValue.identificacion
    );
    formData.append('IdModulo', this.accountService.moduleValue.id.toString());
    formData.append('NombreModulo', this.accountService.moduleValue.nombre);
    formData.append(
      'IdCompania',
      this.accountService.businessValue.id.toString()
    );
    formData.append('NombreCompania', this.accountService.businessValue.nombre);

    this.generalesService
      .postCargaArchivo(formData)
      .pipe(first())
      .subscribe(
        (responseAddCompania) => {
          if (responseAddCompania.exito) {
            this._archivo = undefined;
            this.alertService.success('Archivo cargado correctamente.', {
              keepAfterRouteChange: false,
            });
            this.ObtenerListaDeArchivos();
          } else {
            this.alertService.error(responseAddCompania.responseMesagge, {
              keepAfterRouteChange: false,
            });
          }
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  handleProcesarCarga() {
    if (
      !this._archivoCargaSeleccionado ||
      !this._hojaExcelSeleccionada ||
      !this._fechaSeleccionada.mes ||
      !this._fechaSeleccionada.anno
    ) {
      this.alertService.error(
        'Se debe seleccionar todos los elementos para el proceso.'
      );
      return;
    }

    let oRiesgoCreditoProcesamientoCarga: RiesgoCreditoProcesamientoCarga = {
      ArchivoCarga: {
        Id: parseInt(this._archivoCargaSeleccionado),
        IdCompania: this.accountService.businessValue.id,
        IdModulo: this.accountService.moduleValue.id,
        IdUsuario: this.accountService.userValue.id,
      } as ArchivoCarga,
      HojaExcel: {
        nombreMostrar: this._hojaExcelSeleccionada,
      } as HojasExcel,
      Mes: this._fechaSeleccionada.mes,
      Anno: this._fechaSeleccionada.anno,
    };

    this.riesgoCreditoService
      .postProcesarCarga(oRiesgoCreditoProcesamientoCarga)
      .pipe(first())
      .subscribe(
        (resp) => {
          if (resp.exito) {
            this.alertService.success(resp.responseMesagge, {
              keepAfterRouteChange: false,
            });
          } else {
            this.alertService.error(resp.responseMesagge);
          }
        },
        (error) => {
          this.alertService.error(error);
        }
      );
  }

  //#endregion
}
