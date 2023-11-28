import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { User, Role, ResponseMessage } from '@app/_models';
import { Compania } from '../../_models/modules/compania';
import { administrator, httpAccessAdminPage, httpLandingIndexPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';

@Component({templateUrl: 'HTML_AddEditUserPage.html',
            styleUrls: [ '../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss']
})
export class AddEditUserComponent extends OnSeguridad implements OnInit {
  usuarioForm: FormGroup;

  userObservable: User;
  businessObservable: Compania;

  response: ResponseMessage;
  
  loading : boolean = false;
  submitFormUsuario : boolean = false;

  pIdentifUserUpdate: string;
  
  esAdmin : boolean;

  updateUser  : boolean = false;
  addUser     : boolean = false;

  role: Role = new Role();
  listRolesBusiness: Role[] = [];

  URLRedirectPage: string = httpLandingIndexPage.indexHTTP;
  URLListUserPage: string = httpAccessAdminPage.urlPageListUsers;

  nombreRol : string = 'Sin Asignar';

  tituloBasePantalla: string = 'Parametrización de Usuarios';

  usuarioSeleccionado : User = new User();

  public IdUserSessionRequest : string ;
  public UserSessionRequest : string ;
  public BusinessSessionRequest : string ;
  public ModuleSessionRequest : string ;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private alertService: AlertService ) {

    super(alertService, accountService, router);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateIndexHttp()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.userObservable = this.accountService.userValue;
    this.businessObservable = this.accountService.businessValue;

    if (super.validarUsuarioAdmin()) this.URLRedirectPage = this.URLListUserPage;

    this.inicializaFormulario();
    this.inicializaHeaders();
  }

  inicializaHeaders() : void {

    this.IdUserSessionRequest = this.userObservable ? this.userObservable.id.toString() : 'noIdUserValue';
    this.UserSessionRequest = this.userObservable ? this.userObservable.nombreCompleto.toString() : 'noUserNameValue';
    this.BusinessSessionRequest = this.businessObservable ? this.businessObservable.id.toString() : 'noBusinessValue';
    this.ModuleSessionRequest = 'admin';

    // this.IdUserSessionRequest = this.userObservable.id.toString();
    // this.UserSessionRequest = this.userObservable.nombreCompleto.toString();
    // this.BusinessSessionRequest = this.businessObservable.id.toString();
    // this.ModuleSessionRequest = 'admin';
  }

  get f() { return this.usuarioForm.controls; }

  ngOnInit() {

    if (this.route.snapshot.params.pidentificationUser) {

      this.updateUser = true;
      this.pIdentifUserUpdate = this.route.snapshot.params.pidentificationUser;

      this.usuarioForm.controls.rolUsuario.disable();

      if (!this.userObservable.esAdmin && this.userObservable.idRol !== administrator.adminSociedad) {
        this.usuarioForm.controls.identificacionUsuario.disable();
        this.usuarioForm.controls.correoElectronicoUsuario.disable();
        this.usuarioForm.controls.puestoUsuario.disable();
      } else if (this.pIdentifUserUpdate === administrator.identification) {
        this.usuarioForm.controls.identificacionUsuario.disable();
      }

      this.accountService.getUserByIdentification(this.pIdentifUserUpdate,this.IdUserSessionRequest,
                                                                          this.UserSessionRequest,
                                                                          this.BusinessSessionRequest,
                                                                          this.ModuleSessionRequest)
        .pipe(first())
        .subscribe((responseUser) => {

          if (responseUser.idRol) {

            this.accountService.getRolUserBusiness(responseUser.idRol,this.businessObservable.id, this.IdUserSessionRequest,
                                                                                                  this.UserSessionRequest,
                                                                                                  this.BusinessSessionRequest,
                                                                                                  this.ModuleSessionRequest)
            .pipe(first())
            .subscribe((responseRole) => {

                this.role = responseRole;
                this.nombreRol = this.role.nombre;
                this.inicializaFormularioUpdateUser(responseUser, this.nombreRol);
              });

          } else {
            this.role = null;
            this.inicializaFormularioUpdateUser(responseUser, this.nombreRol);
          }  
        });
      
    } else {
      this.usuarioSeleccionado = null;
      this.addUser = true;
      this.inicializaFormularioAddUser();
    }
  }

  inicializaFormulario() : void {
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
  inicializaFormularioUpdateUser(userUpdate : User = null, nombreRol : string = null) : void {

    if (userUpdate) {

      this.usuarioForm = this.formBuilder.group({
        identificacionUsuario:    [userUpdate.identificacion, Validators.required],
        nombreCompletoUsuario:    [userUpdate.nombreCompleto, Validators.required],
        correoElectronicoUsuario: [userUpdate.email, Validators.required],
        puestoUsuario:            [userUpdate.puesto],
        numeroTelefonoUsuario:    [userUpdate.numeroTelefono],
        rolUsuario:               [nombreRol],
        passwordUsuario:          ['', [Validators.minLength(5)]]
      });

    } else {

      this.usuarioForm = this.formBuilder.group({
        identificacionUsuario:    ['', Validators.required],
        nombreCompletoUsuario:    ['', Validators.required],
        correoElectronicoUsuario: ['', Validators.required],
        puestoUsuario:            [''],
        numeroTelefonoUsuario:    [''],
        rolUsuario:               [''],
        passwordUsuario:          ['', [Validators.minLength(5)]]
      });
    }

    this.usuarioSeleccionado = userUpdate;
  }
  inicializaFormularioAddUser() : void {
    this.usuarioForm = this.formBuilder.group({
      identificacionUsuario:    ['', Validators.required],
      nombreCompletoUsuario:    ['', Validators.required],
      correoElectronicoUsuario: ['', Validators.required],
      puestoUsuario:            [''],
      numeroTelefonoUsuario:    [''],
      rolUsuario:               [{value: '', disabled: true}],
      passwordUsuario:          ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  
  crateObjectForm() : User {

    let userForm: User = new User();

    userForm.identificacion = this.usuarioForm.get('identificacionUsuario').value;
    userForm.nombreCompleto = this.usuarioForm.get('nombreCompletoUsuario').value;
    userForm.email = this.usuarioForm.get('correoElectronicoUsuario').value;
    userForm.puesto = this.usuarioForm.get('puestoUsuario').value;
    userForm.numeroTelefono = this.usuarioForm.get('numeroTelefonoUsuario').value;

    userForm.password = this.usuarioForm.get('passwordUsuario').value;

    return userForm;
  }

  actualizarUsuario() : void {

    this.alertService.clear();

    this.submitFormUsuario = true;
    this.loading = true;

    if (this.usuarioForm.invalid) return;

    let userForm: User = this.crateObjectForm();
    userForm.id = this.usuarioSeleccionado.id;

    this.accountService.updateUser(this.pIdentifUserUpdate, userForm, this.IdUserSessionRequest,
                                                                      this.UserSessionRequest,
                                                                      this.BusinessSessionRequest,
                                                                      this.ModuleSessionRequest)
        .pipe(first())
        .subscribe((responseUpdate) => {

            if (responseUpdate.exito) {

              this.alertService.success(responseUpdate.responseMesagge);
              this.usuarioSeleccionado = responseUpdate.objetoDb;
              this.inicializaFormularioUpdateUser(this.usuarioSeleccionado, this.nombreRol);

            } else { this.alertService.error(responseUpdate.responseMesagge); }

            this.submitFormUsuario = false;
            this.loading = false;
          },
          (error) => {
            this.alertService.error(error);
            this.submitFormUsuario = false;
            this.loading = false;
          }
        );
  }

  registrarUsuario() : void {

    this.alertService.clear();

    this.submitFormUsuario = true;
    this.loading = true;

    if (this.usuarioForm.invalid) return;

    let userForm: User = this.crateObjectForm();

    this.accountService.addUser(userForm, this.IdUserSessionRequest,
                                          this.UserSessionRequest,
                                          this.BusinessSessionRequest,
                                          this.ModuleSessionRequest)
        .pipe(first())
        .subscribe((responseAddUser) => {

            if (responseAddUser.exito) {

              if (responseAddUser.objetoDb) this.asociarUsuarioEmpresa(responseAddUser.objetoDb, responseAddUser.responseMesagge); 

            } else { this.alertService.error(responseAddUser.responseMesagge); }

            this.loading = false;
            this.submitFormUsuario = false;
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
            this.submitFormUsuario = false;
          });
  }

  selectObjetoUsuario() : void { this.inicializaFormularioUpdateUser(this.usuarioSeleccionado, this.nombreRol); }

  // ****************************************************
  // MÉTODOS PRIVADOS
  private asociarUsuarioEmpresa(inUsuarioCreado: User, responseMessageAddUser : string) {

    this.accountService.assignBusinessUser(inUsuarioCreado.id, this.businessObservable.id,this.IdUserSessionRequest,
                                                                                          this.UserSessionRequest,
                                                                                          this.BusinessSessionRequest,
                                                                                          this.ModuleSessionRequest)
      .pipe(first())
      .subscribe((response) => {

          if (response.exito) {
            this.alertService.success(responseMessageAddUser + ' ' + response.responseMesagge, { keepAfterRouteChange: true });
            this.router.navigate([this.URLRedirectPage], { relativeTo: this.route });
          
          } else { this.alertService.error(response.responseMesagge); }
        },
        (error) => { this.alertService.error(error); }
      );
  }
  // ****************************************************
}
