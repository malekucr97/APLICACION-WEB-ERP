import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { User, Module, Compania } from '@app/_models';

//

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ResponseMessage } from '@app/_models';
import { ModulesSystem } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';
import { Periocidad } from '@app/_models/Macred/Periocidad';
import { MacredService } from '@app/_services/macred.service';
import { TipoLineaCredito } from '@app/_models/Macred/TipoLineaCredito';

@Component({selector: 'app-tipos-lineas-credito-macred',
            templateUrl: './tipos-lineas-credito.component.html', 
            styleUrls: ['../../../../../assets/scss/app.scss'],
            standalone: false
})
export class TiposLineasCreditoComponent extends OnSeguridad implements OnInit {

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

  public listObjetos : TipoLineaCredito[] = [];
  objSeleccionado: TipoLineaCredito = undefined;

  private nombrePantalla:string = 'tipos-lineas-credito.html';

  habilitaBtnNuevo: boolean = true;
  habilitaBtnActualiza: boolean = false;
  habilitaBtnRegistro: boolean = true;
  habilitaBtnEliminar: boolean = true;

  constructor(private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private MacredService: MacredService,
              private alertService: AlertService,
              private translate: TranslateMessagesService) {

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

        this.actualizaLista();
      });
  }

  // ** MÉTODOS CRUD ** //

  registrar() {

    let objForm = this.obtenerDatosFormulario(); 
    if (!objForm) return;

    this.MacredService.POST_TIPOS_CREDITO(objForm)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {
          this.actualizaLista();
          this.inicializaFormulario();
          this.alertService.success(response.responseMesagge);
        } else { this.alertService.error(response.responseMesagge); }

      } , error => { this.alertService.error(error); });
  }

  actualizar() {

    if (!this.objSeleccionado) {
      this.alertService.error(this.translate.translateKey('ALERTS.notCorrectOption'));
      return;
    }

    let objForm = this.obtenerDatosFormulario(false);
    if (!objForm) return;
    
    this.MacredService.PUT_TIPOS_CREDITO(objForm)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {
          this.actualizaLista();
          this.inicializaFormulario();
          this.alertService.success(response.responseMesagge);
        } else { this.alertService.error(response.responseMesagge); }
      
      } , error => { this.alertService.error(error); });
  }

  eliminar() {

    if (!this.objSeleccionado) return;

    this.alertService.clear();
    
    this.MacredService.DELETE_TIPOS_CREDITO(this.objSeleccionado)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {
          this.actualizaLista();
          this.inicializaFormulario();
          this.alertService.success(response.responseMesagge);
        } else { this.alertService.error(response.responseMesagge); }

      } , error => { this.alertService.error(error); });
  }


  // ** MÉTODOS PRIVADOS ** //

  private actualizaLista() {
    this.mostrarLista = false;
    this.MacredService.GET_TIPOS_CREDITO()
      .pipe(first())
      .subscribe((response) => { 
        if (response) { 
          this.listObjetos = response;
          if (this.listObjetos && this.listObjetos.length > 0) this.mostrarLista = true;
        }
      });
  }

    private inicializaFormulario(objdUpdate : TipoLineaCredito = null) : void {

    if (objdUpdate) {

      this.add = true; this.update = false;

      this.formObject = this.formBuilder.group({

        nomLineaCredito: [objdUpdate.nomLineaCredito, Validators.required],
        tasaInteres: [objdUpdate.tasaInteres, Validators.required],
        codigoActividadSugef: [objdUpdate.codigoActividadSugef, Validators.required],
        estado: [objdUpdate.estado]
      });

      this.objSeleccionado = objdUpdate;
      this.iniciarBotones(false);

    } else {

      this.add = false; this.update = true;
      this.submitForm = false;

      this.formObject = this.formBuilder.group({
        nomLineaCredito: ['', Validators.required],
        tasaInteres: ['', Validators.required],
        codigoActividadSugef: ['', Validators.required],
        estado: [false]
      });

      this.objSeleccionado = undefined;
      this.iniciarBotones(true);
    }
  }

  private obtenerDatosFormulario(registra : boolean = true): TipoLineaCredito {

    this.alertService.clear();
    this.submitForm = true;

    if (this.formObject.invalid) {
      this.alertService.error(this.translate.translateKey('ALERTS.informationNotValid'));
      return undefined;
    }

    const { nomLineaCredito, tasaInteres, codigoActividadSugef, estado } = this.formObject.controls;

    let obj = new TipoLineaCredito(this.businessObservable.id,
                                    this.moduleObservable.id,
                                    nomLineaCredito.value,
                                    tasaInteres.value, 
                                    codigoActividadSugef.value,
                                    estado.value);

    if (registra) {
      obj.usuarioCreacion = this.userObservable.identificacion; 
      obj.fechaCreacion = new Date();
    } else {
      obj.id = this.objSeleccionado.id;
      obj.usuarioModificacion = this.userObservable.identificacion; 
      obj.fechaModificacion = new Date();
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

  public seleccionarObjeto(obj: TipoLineaCredito) : void {
    this.inicializaFormulario(obj);
    this.iniciarBotones(false);
  }
}