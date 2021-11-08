import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { User } from '../_models';

@Component({ templateUrl: 'HTML_RegistrarUserPage.html' })
export class RegisterUserComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    user: User;

    idempresa: string;

    userForm = new User;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { 
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            identificacion: ['', Validators.required],
            nombre: ['', Validators.required],
            primerApellido: ['', Validators.required],
            segundoApellido: [''],
            email: ['', Validators.required],
            numeroTelefono: [''],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get f() { return this.form.controls; }

    onSubmit() {

        if(this.route.snapshot.params['idempresa']){


        }

        this.idempresa = this.route.snapshot.params['idempresa'];
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.userForm.identificacion = this.form.get('identificacion').value;

        this.userForm.nombreCompleto =  this.form.get('nombre').value + ' ' +
                                    this.form.get('primerApellido').value + ' ' +
                                    this.form.get('segundoApellido').value;

        this.userForm.email = this.form.get('email').value;
        this.userForm.numeroTelefono = this.form.get('numeroTelefono').value;
        this.userForm.password = this.form.get('password').value;

        this.loading = true;
        this.accountService.addUser(this.userForm)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Usuario registrado correctamente', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}