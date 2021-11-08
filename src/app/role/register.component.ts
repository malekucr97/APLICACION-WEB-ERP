import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';
import { Role } from '@app/_models/role';

@Component({ templateUrl: 'HTML_RegistrarRolPage.html' })
export class RegisterRoleComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    role : Role;

    users = null;
    user: User;

    roles = null;

    idBusiness: string;

    constructor(private accountService: AccountService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private alertService: AlertService) {

            this.user = this.accountService.userValue;
        }

    get f() { return this.form.controls; }

    ngOnInit() {
        this.alertService.clear();

        this.form = this.formBuilder.group({
            identificacion: ['', Validators.required],
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required]
        });

        if(this.route.snapshot.params['idempresa']){

            this.idBusiness = this.route.snapshot.params['idempresa'];

            this.accountService.getRolesBusiness(this.idBusiness)
            .pipe(first())
            .subscribe(roles => 
                
                this.roles = roles);
        }
    }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.role.id = this.form.get('identificacion').value;
        this.role.nombre = this.form.get('nombre').value;
        this.role.descripcion = this.form.get('descripcion').value;

        this.loading = true;
        this.accountService.registerRole(this.role)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Rol registrado con éxito !', { keepAfterRouteChange: true });
                    this.router.navigate([''], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.deleteUser(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id);
            });
    }
}