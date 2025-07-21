import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { Compania } from '../../_models/modules/compania';
import { User } from '@app/_models';
import { httpAccessAdminPage } from '@environments/environment';
import { OnSeguridad } from '@app/_helpers/abstractSeguridad';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

@Component({
    templateUrl: 'HTML_AddEditBusinessPage.html',
    styleUrls: ['../../../assets/scss/app.scss', '../../../assets/scss/administrator/app.scss'],
    standalone: false
})
export class AddEditBusinessComponent extends OnSeguridad implements OnInit {
  
  public form: UntypedFormGroup;
  public urladminListBusiness: string;

  public userObserver: User;
  public listBusinessSubs: Compania[]; public business: Compania;

  public pidBusiness: number;

  public loading : boolean; public submitted : boolean;

  public updateBusiness: boolean; public addBusiness: boolean;

  constructor(private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private alertService: AlertService,
              private translate: TranslateMessagesService ) {

    super(alertService, accountService, router, translate);

    // ***************************************************************
    // VALIDA ACCESO PANTALLA LOGIN ADMINISTRADOR
    if (!super.userAuthenticateAdmin()) { this.accountService.logout(); return; }
    // ***************************************************************

    this.urladminListBusiness = httpAccessAdminPage.urlPageListBusiness;

    this.loading = false; this.submitted = false;

    this.userObserver = this.accountService.userValue;
    this.listBusinessSubs = this.accountService.businessListValue;

    this.inicializaFormulario();
  }

  get f() { return this.form.controls; }

  ngOnInit() {

    if (this.route.snapshot.params.pidBusiness) {

      this.updateBusiness = true;
      this.pidBusiness = this.route.snapshot.params.pidBusiness;

      this.accountService.getBusinessById(this.pidBusiness)
        .pipe(first())
        .subscribe((responseBusiness) => {
            
          this.f.nombreCompania.setValue(responseBusiness.nombre);
          this.f.cedulajuridica.setValue(responseBusiness.cedulaJuridica);
          this.f.mantenimientoReportes.setValue(responseBusiness.mantenimientoReportes);
          this.f.cuentaCorreoDefecto.setValue(responseBusiness.cuentaCorreoDefecto);
          this.f.tamanoModuloDefecto.setValue(responseBusiness.tamanoModuloDefecto);
          
        }, (error) => { this.alertService.error(error); });
    } 
    else { this.addBusiness = true; }
  }

  onSubmit() {

    this.submitted = true; this.loading = true;

    let currentDate = new Date();

    if (this.form.invalid) { this.loading = false; return; };

    this.business = new Compania();

    this.business.nombre = this.form.get('nombreCompania').value;
    this.business.cedulaJuridica = this.form.get('cedulajuridica').value;
    this.business.correoElectronico = 'No registrado';
    this.business.tipoIdentificacion = 'NA';
    this.business.detalleDireccion = 'No registrado';
    this.business.telefono = 'NA';
    this.business.mantenimientoReportes = this.form.get('mantenimientoReportes').value;
    this.business.cuentaCorreoDefecto = this.form.get('cuentaCorreoDefecto').value;
    this.business.tamanoModuloDefecto = this.form.get('tamanoModuloDefecto').value;

    this.business.adicionadoPor = this.userObserver.identificacion;
    this.business.fechaAdicion = currentDate;

    // registro compañía
    if (this.addBusiness) {

      if (this.validaRegistroCompania(this.business.cedulaJuridica)) {
        
        this.accountService.addBusiness(this.business)
          .pipe(first())
          .subscribe((response) => {

            this.loading = false;

            if (response.exito) {
              this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
            } else {
              this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
            }

            this.router.navigate([this.urladminListBusiness], { relativeTo: this.route });

          }, (error) => { this.alertService.error(error); this.loading = false; });
      
      } else { this.loading = false; this.alertService.info(this.translate.translateKey('ALERTS.EXISTING_IDENTIFICATION_BUSINESS')); }
    }

    // actualiza compañía
    if (this.updateBusiness) {

      this.business.id = this.pidBusiness;

      this.accountService.updateBusiness(this.business)
        .pipe(first())
        .subscribe((response) => {

          this.loading = false;

          if (response.exito) {
            this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
          } else {
            this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
          }

          this.router.navigate([this.urladminListBusiness], { relativeTo: this.route });

        }, (error) => { this.alertService.error(error); this.loading = false; });
    }
  }

  // -- // métodos privados
  private inicializaFormulario() : void {

    this.form = this.formBuilder.group({nombreCompania: ['', Validators.required],
                                        cedulajuridica: ['', Validators.required],
                                        mantenimientoReportes: [false, Validators.required],
                                        cuentaCorreoDefecto: [false, Validators.required],
                                        tamanoModuloDefecto: [false, Validators.required]});
  }
  private validaRegistroCompania(pcedulaJuridica: string) : boolean {

    if (this.listBusinessSubs && this.listBusinessSubs.length > 0) {
     
      for (let index = 0; index < this.listBusinessSubs.length; index++) {

        if (this.listBusinessSubs[index].cedulaJuridica === pcedulaJuridica) return false ;
      }
    }
    return true;
  }
}
