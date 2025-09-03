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
import { Entidad } from '@app/_models/RiesgoCredito/entidad';
import { RiesgoCreditoService } from '@app/_services/riesgoCredito.service';

@Component({selector: 'app-entidades',
            templateUrl: './entidades.component.html', styleUrls: ['../../../../assets/scss/app.scss'],
            standalone: false
})
export class EntidadesComponent extends OnSeguridad implements OnInit {

  formObject: UntypedFormGroup;
  response: ResponseMessage;
  // pIdentifUserUpdate: string;
  
  submitForm: boolean;
  
  // pwdPattern: string; ussPattern: string; emailPattern: string;
  add: boolean; update: boolean;
  // role: Role;  nombreRol: string;
  URLIndexModulePage: string;

  // ## -- objetos suscritos -- ## //
  private userObservable: User; 
  private businessObservable: Compania; 
  private moduleObservable: Module;
  // ## -- ----------------- -- ## //

  public moduleName : string ;
  public mostrarLista: boolean ;

  public listEntidadesCompania : Entidad[] = [];

  private nombrePantalla:string = 'entidades.html';

  entidadSeleccionada: Entidad = undefined;

  habilitaBtnNuevo: boolean = true;
  habilitaBtnActualiza: boolean = false;
  habilitaBtnRegistro: boolean = true;
  habilitaBtnEliminar: boolean = true;

  constructor(private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private riesgoCreditoService: RiesgoCreditoService,
              private alertService: AlertService,
              private translate: TranslateMessagesService) {

    super(alertService, accountService, router, translate);

    // ************************************
    // VALIDA ACCESO PANTALLA *************
    if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
    // ************************************

    // **
    // ** INICIALIZACIÓN DE VARIABLES
    this.URLIndexModulePage = ModulesSystem.riesgocreditobasehref + 'index.html';

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

        this.actualizaListaEntidades();
      });
  }

  // ** MÉTODOS CRUD ** //

  registrar() {

    let objForm = this.obtenerDatosFormulario(); 
    if (!objForm) return;

    this.riesgoCreditoService.POST_ENTIDAD(objForm)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {
          this.actualizaListaEntidades();
          this.inicializaFormulario();
          this.alertService.success(response.responseMesagge);
        } else { this.alertService.error(response.responseMesagge); }

      } , error => { this.alertService.error(error); });
  }

  actualizar() {

    if (!this.entidadSeleccionada) {
      this.alertService.error(this.translate.translateKey('ALERTS.notCorrectOption'));
      return;
    }

    let objForm = this.obtenerDatosFormulario(false);
    if (!objForm) return;
    
    this.riesgoCreditoService.PUT_ENTIDAD(objForm)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {
          this.actualizaListaEntidades();
          this.inicializaFormulario();
          this.alertService.success(response.responseMesagge);
        } else { this.alertService.error(response.responseMesagge); }
      
      } , error => { this.alertService.error(error); });
  }

  eliminar() {

    if (!this.entidadSeleccionada) return;

    this.alertService.clear();
    
    this.riesgoCreditoService.DELETE_ENTIDAD(this.entidadSeleccionada)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {
          this.actualizaListaEntidades();
          this.inicializaFormulario();
          this.alertService.success(response.responseMesagge);
        } else { this.alertService.error(response.responseMesagge); }

      } , error => { this.alertService.error(error); });
  }


  // ** MÉTODOS PRIVADOS ** //

  private actualizaListaEntidades() {
    this.riesgoCreditoService.GET_ENTIDAD()
      .pipe(first())
      .subscribe((response) => { 
        if (response) { 
          this.listEntidadesCompania = response;
          if (this.listEntidadesCompania && this.listEntidadesCompania.length > 0) this.mostrarLista = true;
        }
      });
  }

    private inicializaFormulario(entidadUpdate : Entidad = null) : void {

    if (entidadUpdate) {

      this.add = true; this.update = false;

      this.formObject = this.formBuilder.group({
        nombreEntidad: [entidadUpdate.nombre, Validators.required],
        estadoEntidad: [entidadUpdate.estado]
      });

      this.entidadSeleccionada = entidadUpdate;
      this.iniciarBotones(false);

    } else {

      this.add = false; this.update = true;
      this.submitForm = false;

      this.formObject = this.formBuilder.group({
        nombreEntidad: ['', Validators.required],
        estadoEntidad: [true]
      });

      this.entidadSeleccionada = undefined;
      this.iniciarBotones(true);
    }
  }

  private obtenerDatosFormulario(registra : boolean = true): Entidad {

    this.alertService.clear();
    this.submitForm = true;

    if (this.formObject.invalid) {
      this.alertService.error(this.translate.translateKey('ALERTS.informationNotValid'));
      return undefined;
    }

    const { nombreEntidad, estadoEntidad } = this.formObject.controls;

    let obj = new Entidad(this.businessObservable.id,
                          this.moduleObservable.id,
                          nombreEntidad.value,
                          estadoEntidad.value);

    if (registra) {
      obj.adicionadoPor = this.userObservable.identificacion; 
      obj.fechaAdicion = new Date();
    } else {
      obj.id = this.entidadSeleccionada.id;
      obj.modificadoPor = this.userObservable.identificacion; 
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

  public seleccionarObjeto(entidad: Entidad) : void {
    this.inicializaFormulario(entidad);
    this.iniciarBotones(false);
  }
}