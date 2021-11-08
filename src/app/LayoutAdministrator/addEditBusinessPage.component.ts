import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { User } from '../_models';
import { Business } from '@app/_models/business';

@Component({ templateUrl: 'HTML_AddEditBusinessPage.html' })
export class AddEditBusinessComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    user = new User;
    business = new Business;

    pidBusiness: string;

    updateBusiness: boolean;
    addBusiness: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {

        this.alertService.clear();

        this.updateBusiness = false;
        this.addBusiness = false;

        if (this.route.snapshot.params.pidBusiness){ 
            this.pidBusiness = this.route.snapshot.params.pidBusiness
            this.updateBusiness = true;

        } else { this.addBusiness = true; }

        this.form = this.formBuilder.group({
            nombre: ['', Validators.required],
            cedulajuridica: ['', Validators.required]
        });

        if (this.updateBusiness){

            this.accountService.getBusinessById(this.pidBusiness)
            .pipe(first())
            .subscribe(responseBusiness => {

                this.f.nombre.setValue(responseBusiness.nombre);
                this.f.cedulajuridica.setValue(responseBusiness.cedulaJuridica);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }
        this.loading = true;

        
        this.business.nombre = this.form.get('nombre').value;
        this.business.cedulaJuridica = this.form.get('cedulajuridica').value;

        if (this.addBusiness) {

            this.business.id = 'ID-' + this.form.get('cedulajuridica').value;

            this.accountService.addBusiness(this.business)
            .pipe(first())
            .subscribe(
                response => {

                    this.router.navigate(['/_AdminModule/AdminListBusinessPage'], { relativeTo: this.route });

                    if (response.exito) {
                        this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    } else {
                        this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        }

        if (this.updateBusiness) {

            this.business.id = this.pidBusiness;

            this.accountService.updateBusiness(this.business)
            .pipe(first())
            .subscribe(
                response => {

                    this.router.navigate(['/_AdminModule/AdminListBusinessPage'], { relativeTo: this.route });

                    if (response.exito) {
                        this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    } else {
                        this.alertService.error(response.responseMesagge, { keepAfterRouteChange: true });
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        }
    }
}