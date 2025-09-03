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
import { RiesgoCreditoService } from '@app/_services/riesgoCredito.service';
import { Categoria } from '@app/_models/RiesgoCredito/categoria';

@Component({selector: 'app-porcentajes-estimacion-cat',
            templateUrl: './porcentajes-estimacion-cat.component.html', 
            styleUrls: ['../../../../../assets/scss/app.scss'],
            standalone: false
})
export class PorcentajesEstimacionCatComponent extends OnSeguridad implements OnInit {

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

  public listCategoriasCompania : Categoria[] = [];

  objSeleccionado: Categoria = undefined;

  habilitaBtnNuevo: boolean = true;
  habilitaBtnActualiza: boolean = false;
  habilitaBtnRegistro: boolean = true;
  habilitaBtnEliminar: boolean = true;

  private nombrePantalla:string = 'porcentajes-estimacion-categoria.html';

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

        this.actualizaLista();
      });
  }
// ** MÉTODOS CRUD ** //

  registrar() {

    let objForm = this.obtenerDatosFormulario(); 
    if (!objForm) return;

    this.riesgoCreditoService.POST_CATEGORIA(objForm)
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
    
    this.riesgoCreditoService.PUT_CATEGORIA(objForm)
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
    
    this.riesgoCreditoService.DELETE_CATEGORIA(this.objSeleccionado)
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
    this.riesgoCreditoService.GET_CATEGORIA()
      .pipe(first())
      .subscribe((response) => { 
        if (response) { 
          this.listCategoriasCompania = response;
          if (this.listCategoriasCompania && this.listCategoriasCompania.length > 0) this.mostrarLista = true;
        }
      });
  }

    private inicializaFormulario(objUpdate : Categoria = null) : void {

    if (objUpdate) {

      this.add = true; this.update = false;

      this.formObject = this.formBuilder.group({
        descripcion: [objUpdate.descripcion, Validators.required],
        nivel: [objUpdate.nivel, Validators.required],
        estimacionCubierta: [objUpdate.estimacionCubierta, Validators.required],
        estimacionDescubierta: [objUpdate.estimacionDescubierta, Validators.required]
      });

      this.objSeleccionado = objUpdate;
      this.iniciarBotones(false);

    } else {

      this.add = false; this.update = true;
      this.submitForm = false;

      this.formObject = this.formBuilder.group({
        descripcion: ['', Validators.required],
        nivel: [null, Validators.required],
        estimacionCubierta: [null, Validators.required],
        estimacionDescubierta: [null, Validators.required]
      });

      this.objSeleccionado = undefined;
      this.iniciarBotones(true);
    }
  }

  private obtenerDatosFormulario(registra : boolean = true): Categoria {

    this.alertService.clear();
    this.submitForm = true;

    if (this.formObject.invalid) {
      this.alertService.error(this.translate.translateKey('ALERTS.informationNotValid'));
      return undefined;
    }

    const { descripcion, nivel, estimacionCubierta, estimacionDescubierta } = this.formObject.controls;

    let obj = new Categoria(this.businessObservable.id,
                              this.moduleObservable.id,
                              descripcion.value,
                              nivel.value,
                              estimacionCubierta.value,
                              estimacionDescubierta.value);

    if (registra) {
      obj.adicionadoPor = this.userObservable.identificacion; 
      obj.fechaAdicion = new Date();
    } else {
      obj.id = this.objSeleccionado.id;
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

  public seleccionarObjeto(obj: Categoria) : void {
    this.inicializaFormulario(obj);
    this.iniciarBotones(false);
  }
}
