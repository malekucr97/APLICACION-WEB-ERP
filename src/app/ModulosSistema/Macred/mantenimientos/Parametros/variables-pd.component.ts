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
import { VariablesPD } from '@app/_models/Macred';

@Component({selector: 'app-variables-pd-macred',
            templateUrl: './variables-pd.component.html', 
            styleUrls: ['../../../../../assets/scss/macred/app.scss'],
            standalone: false
})
export class VariablesPDComponent extends OnSeguridad implements OnInit {

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

  public listObjetos : VariablesPD[] = [];
  
  objSeleccionado: VariablesPD = undefined;

  private nombrePantalla:string = 'variables-pd.html';

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

    this.MacredService.postVariablePD(objForm)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {

          this.submitForm = false;
          this.inicializaFormulario();
          this.getListaValores();
          this.alertService.success(response.responseMesagge);

        } else { this.alertService.error(response.responseMesagge); }

      } , error => { this.alertService.error(error); });
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

    this.MacredService.putVariablePD(objForm)
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
    
    this.MacredService.deleteVariablePD(this.objSeleccionado.id)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {

          this.inicializaFormulario();
          this.getListaValores();
          this.alertService.success(response.responseMesagge);

        } else { this.alertService.error(response.responseMesagge); }

      } , error => { this.alertService.error(error); });
  }


  // ** MÉTODOS PRIVADOS ** //

  private getListaValores() {

    this.mostrarLista = false;

    this.MacredService.getVariablesPD()
      .pipe(first())
      .subscribe((response) => {
        if (response && response.length > 0) {
          this.listObjetos = response;
          this.mostrarLista = true;
        }
      });
  }

  private inicializaFormulario(objdUpdate : VariablesPD = null) : void {

    if (objdUpdate) {

      this.add = true; this.update = false;

      this.formObject = this.formBuilder.group({
        descripcion: [objdUpdate.descripcionVariable, Validators.required],
        coeficiente: [objdUpdate.valorCoeficiente, Validators.required],
        equivalente: [objdUpdate.codCampoEquivalente, Validators.required],
        estado: [objdUpdate.estado]
      });

      this.objSeleccionado = objdUpdate;
      this.iniciarBotones(false);

    } else {

      this.add = false; this.update = true;
      this.submitForm = false;

      this.formObject = this.formBuilder.group({
        descripcion: [null, Validators.required],
        coeficiente: [null, Validators.required],
        equivalente: [null, Validators.required],
        estado: [false]
      });

      this.objSeleccionado = undefined;
      this.iniciarBotones(true);
    }
  }

  private obtenerDatosFormulario(registra : boolean = true): VariablesPD {

    const { descripcion, coeficiente, equivalente, estado } = this.formObject.controls;

    let obj : VariablesPD = new VariablesPD;

    obj.descripcionVariable = descripcion.value;
    obj.valorCoeficiente = coeficiente.value;
    obj.codCampoEquivalente = equivalente.value;
    obj.estado = estado.value;

    if (registra) {
      obj.codigoCompania = this.businessObservable.id;
      obj.usuarioCreacion = this.userObservable.identificacion; 
      obj.fechaCreacion = this.today;
    } else {
      obj.id = this.objSeleccionado.id;
      obj.usuarioModificacion = this.userObservable.identificacion; 
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

  public seleccionarObjeto(obj: VariablesPD) : void {
    this.inicializaFormulario(obj);
    this.iniciarBotones(false);
  }
}