import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { User, Module, Compania } from '@app/_models';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ResponseMessage } from '@app/_models';
import { ModulesSystem } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { MacredService } from '@app/_services/macred.service';
import { MacNivelCapacidadPago } from '@app/_models/Macred';
import { DialogoConfirmacionComponent } from '@app/_components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';

@Component({selector: 'app-niveles-capacidad-pago-macred',
            templateUrl: './niveles-capacidad-pago.component.html', 
            styleUrls: ['../../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class NivelesCapacidadPagoComponent extends OnSeguridad implements OnInit {

  formObject: UntypedFormGroup;
  response: ResponseMessage;
  
  submitForm: boolean;
  
  add: boolean; update: boolean;
  URLIndexModulePage: string;

  // ## -- objetos suscritos -- ## //
  private userObservable: User; 
  private businessObservable: Compania; 
  private moduleObservable: Module;
  // ## -- ----------------- -- ## //

  public moduleName : string ;
  public mostrarLista: boolean ;

  public listObjetos : MacNivelCapacidadPago[] = [];
  
  objSeleccionado: MacNivelCapacidadPago = undefined;

  private nombrePantalla:string = 'niveles-capacidad-pago.html';

  habilitaBtnNuevo: boolean = true;
  habilitaBtnActualiza: boolean = false;
  habilitaBtnRegistro: boolean = true;
  habilitaBtnEliminar: boolean = true;

  public today : Date = new Date();

  constructor(private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private MacredService: MacredService,
              private alertService: AlertService,
              private translate: TranslateMessagesService,
              private dialogo: MatDialog) {

    super(alertService, accountService, router, translate);

    // ************************************
    // VALIDA ACCESO PANTALLA *************
    if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
    // ************************************

    // **
    // ** INICIALIZACIÓN DE VARIABLES
    this.URLIndexModulePage = ModulesSystem.macredbasehref + 'index.html';

    this.submitForm = false;
    this.mostrarLista = false;
    // **
    
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.businessObservable = this.accountService.businessValue;

    this.inicializaFormulario();
  }

  get f() { return this.formObject.controls; }

  ngOnInit(): void {

    this.accountService.validateAccessUser( this.userObservable.id,
                                            this.moduleObservable.id,
                                            this.nombrePantalla,
                                            this.businessObservable.id)
      .pipe(first())
      .subscribe((response) => { 

        if (!response.exito) this.redirectIndexModule();

        this.moduleName = this.moduleObservable.nombre;

        this.getListaValores();
      });
  }

  // ** MÉTODOS CRUD ** //

  post() {

    this.alertService.clear();
    this.submitForm = true;

    if (this.formObject.invalid) {
      this.alertService.error(this.translate.translateKey('ALERTS.informationNotValid'));
      return undefined;
    }

    let objForm = this.obtenerDatosFormulario();

    this.MacredService.postNiveleCapacidadPago(objForm)
        .pipe(first())
        .subscribe((response) => {
          
          if (response.exito) {

            this.submitForm = false;
            this.inicializaFormulario();
            this.getListaValores();
            this.alertService.success(response.responseMesagge);

          } else { this.alertService.error(response.responseMesagge); }
        }, error => { this.alertService.error(error); });
  }

  put() {

    this.alertService.clear();
    this.submitForm = true;

    if (this.formObject.invalid) {
      this.alertService.error(this.translate.translateKey('ALERTS.informationNotValid'));
      return undefined;
    }

    let objForm = this.obtenerDatosFormulario(false);
    if (!objForm) return;

    this.MacredService.putNiveleCapacidadPago(objForm)
        .pipe(first())
        .subscribe((response) => {

          if (response.exito) {

            this.submitForm = false;
            this.inicializaFormulario();
            this.getListaValores();
            this.alertService.success(response.responseMesagge);

          } else { this.alertService.error(response.responseMesagge); }
        }, error => { this.alertService.error(error); });
  }

  delete() {

    if (!this.objSeleccionado) return;

    this.alertService.clear();

    this.dialogo.open(DialogoConfirmacionComponent, { 
        data: 'Seguro que desea eliminar : ' + this.objSeleccionado.descripcion + ' ?' 
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {

        if (confirmado) {

            this.MacredService.deleteNiveleCapacidadPago(this.objSeleccionado.id)
              .pipe(first())
              .subscribe((response) => {
                
                if (response.exito) {

                  this.inicializaFormulario();
                  this.getListaValores();
                  this.alertService.success(response.responseMesagge);

                } else { this.alertService.error(response.responseMesagge); }
              } , error => { this.alertService.error(error); });

        } else { return; }
    });
  }


  // ** MÉTODOS PRIVADOS ** //

  private getListaValores() {

    this.mostrarLista = false;

    this.MacredService.getNivelesCapacidadPago(true)
      .pipe(first())
      .subscribe((response) => {

        if (response && response.length > 0) {
          this.listObjetos = response;
          this.mostrarLista = true;
        }
    }, error => { this.alertService.error(error); });
  }

  private inicializaFormulario(objdUpdate : MacNivelCapacidadPago = null) : void {

    if (objdUpdate) {

      this.add = true; this.update = false;

      this.formObject = this.formBuilder.group({
        descripcion: [objdUpdate.descripcion, Validators.required],
        puntaje: [objdUpdate.puntaje, Validators.required],
        rangoInicial: [objdUpdate.rangoInicial, Validators.required],
        rangoFinal: [objdUpdate.rangoFinal, Validators.required],
        tieneCapacidadPago: [objdUpdate.tieneCapacidadPago],
        estado: [objdUpdate.estado]
      });

      this.objSeleccionado = objdUpdate;
      this.iniciarBotones(false);

    } else {

      this.add = false; this.update = true;
      this.submitForm = false;

      this.formObject = this.formBuilder.group({
        descripcion: [null, Validators.required],
        puntaje: [null, Validators.required],
        rangoInicial: [null, Validators.required],
        rangoFinal: [null, Validators.required],
        tieneCapacidadPago: [false],
        estado: [false]
      });

      this.objSeleccionado = undefined;
      this.iniciarBotones(true);
    }
  }

  private obtenerDatosFormulario(registra : boolean = true): MacNivelCapacidadPago {

    const { descripcion, 
            puntaje, 
            rangoInicial, 
            rangoFinal, 
            tieneCapacidadPago, 
            estado } = this.formObject.controls;

    let obj : MacNivelCapacidadPago = new MacNivelCapacidadPago;

    obj.descripcion = descripcion.value;
    obj.puntaje = puntaje.value;
    obj.rangoInicial = rangoInicial.value;
    obj.rangoFinal = rangoFinal.value;
    obj.tieneCapacidadPago = tieneCapacidadPago.value;
    obj.estado = estado.value;

    if (registra) {
      obj.codigoCompania = this.businessObservable.id;
      obj.adicionadoPor = this.userObservable.identificacion; 
      obj.fechaAdicion = this.today;
    } else {
      obj.id = this.objSeleccionado.id;
      obj.modificadoPor = this.userObservable.identificacion; 
      obj.fechaModificacion = this.today;
    }
    return obj;
  }

  private iniciarBotones(esParaAgregar: boolean) {
    this.habilitaBtnNuevo = !esParaAgregar;
    this.habilitaBtnRegistro = esParaAgregar;
    this.habilitaBtnActualiza = !esParaAgregar;
    this.habilitaBtnEliminar = !esParaAgregar;
  }

  // ** MÉTODOS HTML ** //

  public redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

  public limpiarFormulario() { this.inicializaFormulario(); }

  public seleccionarObjeto(obj: MacNivelCapacidadPago) : void {
    this.inicializaFormulario(obj);
    this.iniciarBotones(false);
  }
}