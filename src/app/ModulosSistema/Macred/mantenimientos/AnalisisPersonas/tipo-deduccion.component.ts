import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { Compania, Module, User } from '@app/_models';
import { TipoObligacion } from '@app/_models/Macred/TipoObligacion';
import { AccountService, AlertService, TranslateMessagesService } from '@app/_services';
import { MacredService } from '@app/_services/macred.service';
import { ModulesSystem } from '@environments/environment';
import { first } from 'rxjs/operators';

@Component({selector: 'app-tipo-deduccion-macred',
            templateUrl: './tipo-deduccion.component.html',
            styleUrls: [ '../../../../../assets/scss/app.scss' ],
            standalone: false
})
export class TipoObligacionComponent extends OnSeguridad implements OnInit {
  
  private nombrePantalla: string = 'tipos-deducciones.html';

  // ## -- objetos suscritos -- ## //
  private userObservable: User;
  private moduleObservable: Module;
  private businessObservable: Compania;

  // FORMULARIO ACTIVIDAD ECONOMICA
  formObject: UntypedFormGroup;

  listObjetos: TipoObligacion[] = [];

  // **

  habilitaBtnNuevo: boolean = true;
  habilitaBtnActualiza: boolean = false;
  habilitaBtnRegistro: boolean = true;
  habilitaBtnEliminar: boolean = true;

  public objSeleccionado: TipoObligacion = undefined;

  public add: boolean; public update: boolean;

  public submitForm: boolean; 
  public mostrarLista: boolean;

  public URLIndexModulePage: string;
  public moduleName : string;

  constructor(private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private macredService: MacredService,
              private alertService: AlertService,
              private translate: TranslateMessagesService ) {

    super(alertService, accountService, router, translate);

    // ************************************
    // VALIDA ACCESO PANTALLA *************
    if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
    // ************************************

    this.userObservable = this.accountService.userValue;
    this.moduleObservable = this.accountService.moduleValue;
    this.businessObservable = this.accountService.businessValue;

    this.submitForm = false;
    this.mostrarLista = false;

    this.URLIndexModulePage = ModulesSystem.macredbasehref + 'index.html';

    this.inicializaFormulario();
  }

  public redirectIndexModule() : void { this.router.navigate([this.URLIndexModulePage]); }

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

    this.macredService.POST_TIPO_DEDUCCION(objForm)
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
    
    this.macredService.PUT_TIPO_DEDUCCION(objForm)
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
    
    this.macredService.DELETE_TIPO_DEDUCCION(this.objSeleccionado)
      .pipe(first())
      .subscribe((response) => {
        
        if (response.exito) {
          this.actualizaLista();
          this.inicializaFormulario();
          this.alertService.success(response.responseMesagge);
        } else { this.alertService.error(response.responseMesagge); }

      } , error => { this.alertService.error(error); });
  }

  public seleccionarObjeto(obj: TipoObligacion) : void {
    this.inicializaFormulario(obj);
    this.iniciarBotones(false);
  }

  private actualizaLista() {
    this.mostrarLista = false;
    this.macredService.GET_TIPO_DEDUCCION()
      .pipe(first())
      .subscribe((response) => { 
        if (response) { 
          this.listObjetos = response;
          if (this.listObjetos && this.listObjetos.length > 0) this.mostrarLista = true;
        }
      });
  }

  private inicializaFormulario(objUpdate : TipoObligacion = null) : void {
  
    if (objUpdate) {

      this.add = true; this.update = false;

      this.formObject = this.formBuilder.group({
        descripcion: [objUpdate.descripcion, [Validators.required, Validators.maxLength(100)]],
        estado: [objUpdate.estado],
      });

      this.objSeleccionado = objUpdate;
      this.iniciarBotones(false);

    } else {

      this.add = false; this.update = true;
      this.submitForm = false;

      this.formObject = this.formBuilder.group({
        descripcion: [null, [Validators.required, Validators.maxLength(100)]],
        estado: [false],
      });

      this.objSeleccionado = undefined;
      this.iniciarBotones(true);
    }
  }

  public limpiarFormulario() { this.inicializaFormulario(); }

  private obtenerDatosFormulario(registra : boolean = true) : TipoObligacion {
  
    this.alertService.clear();
    this.submitForm = true;

    if (this.formObject.invalid) {
      this.alertService.error(this.translate.translateKey('ALERTS.informationNotValid'));
      return undefined;
    }

    const { descripcion, estado } = this.formObject.controls;

    let obj = new TipoObligacion(this.businessObservable.id,
                                  this.moduleObservable.id,
                                  descripcion.value,
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
}
