import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { User } from '../_models';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;

    loading = false;
    submitted = false;
    user = new User;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        const passwordValidators = [Validators.minLength(6)];

        this.form = this.formBuilder.group({
            nombre: ['', Validators.required],
            email: ['', Validators.required],
            numeroTelefono: [''],
            password: ['', passwordValidators]
        });

        this.accountService.getUser(this.id)
            .pipe(first())
            .subscribe(x => {
                this.f.nombre.setValue(x.nombreCompleto);
                this.f.email.setValue(x.email);
                this.f.numeroTelefono.setValue(x.numeroTelefono);
            });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }
        this.loading = true;

        this.user.identificacion = this.id;

        this.user.nombreCompleto =  this.form.get('nombre').value;

        this.user.email = this.form.get('email').value;
        this.user.numeroTelefono = this.form.get('numeroTelefono').value;
        this.user.password = this.form.get('password').value;

        this.updateUser(this.user);
    }

    private updateUser(user: User) {
        this.accountService.updateUser(this.id, user)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Información Actualizada', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
