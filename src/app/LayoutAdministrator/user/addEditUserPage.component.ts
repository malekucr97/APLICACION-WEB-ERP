import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, ResponseMessage } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { administrator, httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({
  templateUrl: 'HTML_AddEditUserPage.html', 
  styleUrls: [ '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddEditUserComponent extends OnSeguridad implements OnInit {
  
  usuarioForm: FormGroup;
  response: ResponseMessage;
  pIdentifUserUpdate: string;
  usuarioSeleccionado: User;
  loading: boolean; submitFormUsuario: boolean;
  userObservable: User; businessObservable: Compania;
  pwdPattern: string; ussPattern: string; emailPattern: string;
  updateUser: boolean; addUser: boolean;
  role: Role; nombreRol: string;
  URLRedirectPage: string; URLListUserPage: string;
  
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private alertService: AlertService,
              private translate: TranslateMessagesService ) {

    super(alertService, accountService, router, translate);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
    // ***************************************************************

    // **
    // ** INICIALIZACIÓN DE VARIABLES
    this.URLRedirectPage = httpLandingIndexPage.indexHTTP;
    this.URLListUserPage = httpAccessAdminPage.urlPageListUsers;

    this.pwdPattern = this._passwordPattern;
    this.ussPattern = this._userPattern;
    this.emailPattern = this._emailPattern;

    this.role = new Role();
    this.nombreRol = 'Role has not been assigned';
    
    this.updateUser = false;
    this.addUser = false;

    this.loading = false;
    this.submitFormUsuario = false;

    this.usuarioSeleccionado = new User();
    // **

    this.userObservable     = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    if (super.validarUsuarioAdmin()) this.URLRedirectPage = this.URLListUserPage;

    this.inicializaFormulario();
  }

  get f() { return this.usuarioForm.controls; }

  ngOnInit() {

    if (this.route.snapshot.params.pidentificationUser) {

      this.updateUser = true;
      this.pIdentifUserUpdate = this.route.snapshot.params.pidentificationUser;

      this.usuarioForm.controls.rolUsuario.disable();
      this.usuarioForm.controls.identificacionUsuario.disable();

      if (!this.userObservable.esAdmin && this.userObservable.idRol !== administrator.adminSociedad) {
        this.usuarioForm.controls.correoElectronicoUsuario.disable(); 
        this.usuarioForm.controls.puestoUsuario.disable();
      }

      this.accountService.getUserByIdentification(this.pIdentifUserUpdate, 
                                                  this._HIdUserSessionRequest, 
                                                  this._HBusinessSessionRequest)
        .pipe(first())
        .subscribe((responseUser) => {

          if (responseUser.idRol) {

            this.accountService.getRolUserBusiness( responseUser.idRol,
                                                    this.businessObservable.id,
                                                    this._HIdUserSessionRequest,
                                                    this._HBusinessSessionRequest )
              .pipe(first())
              .subscribe((responseRole) => {
                this.role = responseRole;
                this.nombreRol = this.role.nombre;
                this.inicializaFormularioUpdateUser(responseUser, this.nombreRol);
              });
          // **
          // ** NO SE HA ASIGNADO ROL A USUARIO
          } else { this.role = null;  this.inicializaFormularioUpdateUser(responseUser, this.nombreRol); }
          // **
        });
    // **
    // ** INICIALIZA REGISTRO DE NUEVO USUARIO
    } else { this.usuarioSeleccionado = null; this.addUser = true; this.inicializaFormularioAddUser(); }
    // **
  }

  // **
  // ** PROCEDIMIENTOS HTML
  selectObjetoUsuario() : void { this.inicializaFormularioUpdateUser(this.usuarioSeleccionado, this.nombreRol); }

  public actualizarUsuario() : void {

    this.alertService.clear();
    this.submitFormUsuario = true; this.loading = true;

    if (this.usuarioForm.invalid) return;

    let userForm: User = this.crateObjectForm();
    userForm.id = this.usuarioSeleccionado.id;

    this.accountService.updateUser( userForm, 
                                    this._HIdUserSessionRequest,
                                    this._HBusinessSessionRequest )
        .pipe(first())
        .subscribe((responseUpdate) => {

          if (responseUpdate.exito) {

            this.alertService.success(responseUpdate.responseMesagge);
            this.usuarioSeleccionado = responseUpdate.objetoDb;
            this.inicializaFormularioUpdateUser(this.usuarioSeleccionado, this.nombreRol);

          } else { this.alertService.error(responseUpdate.responseMesagge); }

          this.submitFormUsuario = false; this.loading = false;
          
        }, (error) => { this.alertService.error(error); this.submitFormUsuario = false; this.loading = false; });
  }

  public registrarUsuario() : void {

    this.alertService.clear();
    this.submitFormUsuario = true; this.loading = true;

    if (this.usuarioForm.invalid) return;

    let userForm: User = this.crateObjectForm();

    this.accountService.addUser(userForm, 
                                this._HIdUserSessionRequest,
                                this._HBusinessSessionRequest)
        .pipe(first())
        .subscribe((responseAddUser) => {

          if (responseAddUser.exito) {

            if (responseAddUser.objetoDb) this.asociarUsuarioEmpresa(responseAddUser.objetoDb, responseAddUser.responseMesagge); 

          } else { this.alertService.error(responseAddUser.responseMesagge); }

          this.loading = false; this.submitFormUsuario = false;

        }, (error) => { this.alertService.error(error); this.loading = false; this.submitFormUsuario = false; });
  }
  // **

  // ****************************************************
  // MÉTODOS PRIVADOS
  private inicializaFormulario() : void {
    this.usuarioForm = this.formBuilder.group({
      identificacionUsuario:    [''],
      nombreCompletoUsuario:    [''],
      correoElectronicoUsuario: [''],
      puestoUsuario:            [''],
      numeroTelefonoUsuario:    [''],
      rolUsuario:               [''],
      passwordUsuario:          ['']
    });
  }
  private inicializaFormularioUpdateUser(userUpdate : User = null, nombreRol : string = null) : void {

    if (userUpdate) {

      this.usuarioForm = this.formBuilder.group({
        identificacionUsuario:    [userUpdate.identificacion],
        nombreCompletoUsuario:    [userUpdate.nombreCompleto, Validators.required],
        correoElectronicoUsuario: [userUpdate.email,Validators.required],
        puestoUsuario:            [userUpdate.puesto],
        numeroTelefonoUsuario:    [userUpdate.numeroTelefono],
        rolUsuario:               [nombreRol],
        passwordUsuario:          ['']
      });

    } else {

      this.usuarioForm = this.formBuilder.group({
        identificacionUsuario:    ['', Validators.required],
        nombreCompletoUsuario:    ['', Validators.required],
        correoElectronicoUsuario: ['', Validators.required],
        puestoUsuario:            [''],
        numeroTelefonoUsuario:    [''],
        rolUsuario:               [''],
        passwordUsuario:          ['', Validators.required]
      });
    }
    this.usuarioSeleccionado = userUpdate;
  }
  private inicializaFormularioAddUser() : void {
    this.usuarioForm = this.formBuilder.group({
      identificacionUsuario:    ['', Validators.required],
      nombreCompletoUsuario:    ['', Validators.required],
      correoElectronicoUsuario: ['', Validators.required],
      puestoUsuario:            [''],
      numeroTelefonoUsuario:    [''],
      rolUsuario:               [{value: '', disabled: true}],
      passwordUsuario:          ['', [Validators.required]]
    });
  }
  private crateObjectForm() : User {

    let userForm: User = new User();

    userForm.identificacion = this.usuarioForm.get('identificacionUsuario').value;
    userForm.nombreCompleto = this.usuarioForm.get('nombreCompletoUsuario').value;
    userForm.email = this.usuarioForm.get('correoElectronicoUsuario').value;
    userForm.puesto = this.usuarioForm.get('puestoUsuario').value;
    userForm.numeroTelefono = this.usuarioForm.get('numeroTelefonoUsuario').value;

    userForm.password = this.usuarioForm.get('passwordUsuario').value;

    return userForm;
  }

  private asociarUsuarioEmpresa(inUsuarioCreado: User, responseMessageAddUser : string) {

    this.accountService.assignBusinessUser( inUsuarioCreado.id, 
                                            this.businessObservable.id,
                                            this._HIdUserSessionRequest, 
                                            this._HBusinessSessionRequest )
      .pipe(first())
      .subscribe((response) => {

          if (response.exito) {

            this.alertService.success(responseMessageAddUser + ' ' + response.responseMesagge, { keepAfterRouteChange: true });
            this.router.navigate([this.URLRedirectPage], { relativeTo: this.route });
          
          } else { this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true }); }
      
        }, (error) => { this.alertService.error(error); });
  }
  // ****************************************************
}
