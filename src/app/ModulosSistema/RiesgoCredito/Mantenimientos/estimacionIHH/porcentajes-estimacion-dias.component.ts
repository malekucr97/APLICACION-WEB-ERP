import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Identificador, Rango } from '@app/_models/RiesgoCredito/rango';

@Component({selector: 'app-porcentajes-estimacion-dias',
            templateUrl: './porcentajes-estimacion-dias.component.html',
            styleUrls: ['../../../../../assets/scss/app.scss'],
            standalone: false
})
export class PorcentajesEstimacionDiasComponent extends OnSeguridad implements OnInit {

  @ViewChild('nuevoIdentificador') inputRef!: ElementRef;

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

  public moduleName : string;

  public mostrarLista: boolean;
  public existeIdentificadores: boolean;

  public listRangosCompania : Rango[] = [];
  public listRangosIdentificadores  : Rango[] = [];
  public listIdentificadores  : Identificador[] = [];

  objSeleccionado: Rango = undefined;

  habilitaBtnNuevo: boolean = true;
  habilitaBtnActualiza: boolean = false;
  habilitaBtnRegistro: boolean = true;
  habilitaBtnEliminar: boolean = true;

  // habilitaBtnNuevoIdentificador: boolean = false;
  habilitaRegistroIdentificador: boolean = false;
  habilitaIdentificador: boolean = false;

  nuevoIdentificador: string = '';

  private nombrePantalla:string = 'porcentajes-estimacion-dias.html';

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
    this.existeIdentificadores = false;
    // **
    
    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.businessObservable = this.accountService.businessValue;

    this.getIdentificadores();
    this.inicializaFormulario();
  }

  private getIdentificadores() : void {

    this.riesgoCreditoService.GET_IDENTIFICADORES_RANGOS()
      .pipe(first())
      .subscribe((response) => { 
        if (response) {
          this.listRangosIdentificadores = response;
          if (this.listRangosIdentificadores && this.listRangosIdentificadores.length > 0) {
            this.existeIdentificadores = true;
            for (let i = 0; i < this.listRangosIdentificadores.length; i++) {
              this.listIdentificadores.push( { identificador: this.listRangosIdentificadores[i].identificador } );
            }
          }
        }

        this.inicializaFormulario();

        if (this.existeIdentificadores) {

          this.habilitaIdentificador = true;
          this.actualizaLista(this.listRangosIdentificadores[0].identificador);

        } else {
          this.habilitaRegistroIdentificador = true; 
        }

      } , error => { this.alertService.error(error); });
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
      });
  }

  registrarIdentificador() {

    this.alertService.clear();
    const ident = this.inputRef.nativeElement.value;

    if (ident) {

      let obj = new Rango(this.businessObservable.id, this.moduleObservable.id, '0', 0, 0, 1, 1, ident);
      obj.adicionadoPor = this.userObservable.identificacion; 
      obj.fechaAdicion = new Date();

      this.registrar(obj);

      this.listIdentificadores.push( { identificador: obj.identificador } );

      // this.listIdentificadores.push( { identificador: obj.identificador } );
      // this.getIdentificadores();
      // this.inicializaFormulario();

      // this.habilitaIdentificador = true;
      // this.habilitaRegistroIdentificador = false;

    } else { this.alertService.error('Ingrese el valor del identificador'); }
  }

  registrar(pobj : Rango = null) {

    let objetoRango : Rango;

    this.alertService.clear();

    if ( !pobj ) {
      
      objetoRango = this.obtenerDatosFormulario(); 
      if (!objetoRango) return;

    } else { objetoRango = pobj; }

    this.riesgoCreditoService.POST_RANGO(objetoRango)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {

          this.actualizaLista(objetoRango.identificador);
          this.inicializaFormulario(objetoRango);

          this.alertService.success(response.responseMesagge);
          
          this.existeIdentificadores = true;
          this.habilitaIdentificador = true;
          this.habilitaRegistroIdentificador = false;

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
    
    this.riesgoCreditoService.PUT_RANGO(objForm)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {
          this.actualizaLista(objForm.identificador); 
          this.inicializaFormulario();
          this.alertService.success(response.responseMesagge);
        } else { this.alertService.error(response.responseMesagge); }
      
      } , error => { this.alertService.error(error); });
  }

  eliminar() {

    if (!this.objSeleccionado) return;

    this.alertService.clear();
    
    this.riesgoCreditoService.DELETE_RANGO(this.objSeleccionado)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {

          this.listIdentificadores = [];

          this.getIdentificadores();
          this.inicializaFormulario();

          // this.alertService.success(response.responseMesagge);

          // this.listIdentificadores = this.listIdentificadores.filter( x => x !== this.objSeleccionado );

          // if(this.listIdentificadores && this.listIdentificadores.length > 0){

          //   this.getIdentificadores();

          //   let ident : string = this.listIdentificadores[0].identificador;
          //   this.actualizaLista(ident); 
          //   this.inicializaFormulario();
          //   this.alertService.success(response.responseMesagge);
          // } else {
          //   window.location.reload();
          // }

          // this.getIdentificadores();
          // this.inicializaFormulario();

          // this.mostrarLista = false;


          // this.actualizaLista();
          // this.listIdentificadores = this.listIdentificadores.filter( x => x !== this.objSeleccionado );
          // this.getIdentificadores();

        } else { this.alertService.error(response.responseMesagge); }

      } , error => { this.alertService.error(error); });
  }


  // ** MÉTODOS PRIVADOS ** //

  private actualizaLista(pidentif : string = null) {

    const identificador = pidentif || this.formObject.controls['identificador'].value;

    this.riesgoCreditoService.GET_RANGOS_IDENTIFICADOR(identificador)
      .pipe(first())
      .subscribe((response) => {
        if (response) { 
          this.listRangosCompania = response;
          if (this.listRangosCompania && this.listRangosCompania.length > 0) this.mostrarLista = true;
        }
      } , error => { this.alertService.error(error); });
  }

    private inicializaFormulario(objUpdate : Rango = null) : void {

    if (objUpdate) {

      this.add = true; this.update = false;

      this.formObject = this.formBuilder.group({
        
        descripcion: [objUpdate.descripcion, Validators.required],
        inicio: [objUpdate.inicio, Validators.required],
        fin: [objUpdate.fin, Validators.required],
        porcentajeEstimacion: [objUpdate.porcentajeEstimacion, Validators.required],
        nivel: [objUpdate.nivel, Validators.required],

        identificador: [this.listIdentificadores.find(x => x.identificador === objUpdate.identificador) , Validators.required]
      });

      this.objSeleccionado = objUpdate;
      this.iniciarBotones(false);

    } else {

      this.add = false; this.update = true;
      this.submitForm = false;

      this.formObject = this.formBuilder.group({
        descripcion: ['', Validators.required],
        inicio: [null, Validators.required],
        fin: [null, Validators.required],
        porcentajeEstimacion: [null, Validators.required],
        nivel: [null, Validators.required],

        identificador: [this.listIdentificadores.length > 0 ? this.listIdentificadores[0] : null, Validators.required]
      });

      this.objSeleccionado = undefined;
      this.iniciarBotones(true);
    }
  }

  private obtenerDatosFormulario(registra : boolean = true): Rango {

    this.alertService.clear();
    this.submitForm = true;

    if (this.formObject.invalid) {
      this.alertService.error(this.translate.translateKey('ALERTS.informationNotValid'));
      return undefined;
    }

    const { descripcion, inicio, fin, porcentajeEstimacion, nivel, identificador } = this.formObject.controls;

    let obj = new Rango(this.businessObservable.id,
                        this.moduleObservable.id,
                        descripcion.value,
                        inicio.value,
                        fin.value,
                        porcentajeEstimacion.value,
                        nivel.value,
                        identificador.value.identificador);

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

  onIdentificadorChange() {

  let opcIdentificador : string = this.formObject.get('identificador')?.value.identificador;
  
  this.actualizaLista(opcIdentificador);

  this.add = false; 
  this.update = true;
  this.submitForm = false;

  this.formObject = this.formBuilder.group({
    descripcion: ['', Validators.required],
    inicio: [null, Validators.required],
    fin: [null, Validators.required],
    porcentajeEstimacion: [null, Validators.required],
    nivel: [null, Validators.required],
    identificador: [this.listIdentificadores.find(x => x.identificador === opcIdentificador) , Validators.required]
  });

  this.objSeleccionado = undefined;
  this.iniciarBotones(true);
}

  public redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

  public limpiarFormulario() { this.inicializaFormulario(); }

  public btnNuevoIdentificador() {

    this.alertService.clear();

    this.iniciarBotones(true);
    
    this.habilitaRegistroIdentificador = true;
    this.existeIdentificadores = false;
    this.habilitaIdentificador = false;
    // this.mostrarLista = false;

  }

  public seleccionarObjeto(obj: Rango) : void {

    this.alertService.clear();

    if( this.habilitaRegistroIdentificador 
        && !this.habilitaIdentificador 
        && !this.existeIdentificadores ) {
      this.habilitaRegistroIdentificador = false;
      this.habilitaIdentificador = true;
      this.existeIdentificadores = true;
    }

    this.inicializaFormulario(obj);
    this.iniciarBotones(false);
  }
}
