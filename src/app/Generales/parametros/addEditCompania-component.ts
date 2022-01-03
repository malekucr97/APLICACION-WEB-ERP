import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { amdinBusiness, httpAccessAdminPage } from '@environments/environment-access-admin';
import { User, Module, Role, ResponseMessage } from '@app/_models';

@Component({
    templateUrl: 'HTML_AddEditCompania.html',
    styleUrls: ['../../../assets/scss/generales/app.scss'],
})
export class AddEditCompaniaComponent implements OnInit {
    form: FormGroup;

    userObservable: User;
    moduleObservable: Module;

    response: ResponseMessage;

    loading = false;
    submitted = false;

    id: string;
    URLRedirectPage: string;

    esAdmin: boolean;
    updateUser: boolean;
    addUser: boolean;

    listRolesBusiness: Role[] = [];

    companiaForm = new User();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
    }

    ngOnInit() {

        this.updateUser = false;
        this.addUser = true;

        // this.router.navigate(['_GeneralesModule/Index.html'], { relativeTo: this.route });

        // this.updateUser = false;
        // this.addUser = false;

        // if (this.addUser) {

        //     this.form = this.formBuilder.group({
        //         identificacion: ['', Validators.required],
        //         nombre: ['', Validators.required],
        //         email: ['', Validators.required],
        //         numeroTelefono: ['', Validators.required],
        //         role: [''],
        //         bus: [''],
        //         roles: ['']
        //     });
        // }

        // if (this.updateUser) {

        //     this.id = this.route.snapshot.params.id;

        //     this.form = this.formBuilder.group({
        //         identificacion: ['', Validators.required],
        //         nombre: ['', Validators.required],
        //         email: ['', Validators.required],
        //         numeroTelefono: ['', Validators.required],
        //         role: [''],
        //         bus: [''],
        //         roles: ['']
        //     });

        //     this.form.controls.identificacion.disable();
        //     this.form.controls.role.disable();

        //     this.accountService.getUserById(this.id)
        //         .pipe(first())
        //         .subscribe(responseUser => {

        //             this.f.identificacion.setValue(responseUser.identificacion);

        //             const arrayNombre = responseUser.nombreCompleto.split(' ');

        //             this.f.nombre.setValue(arrayNombre[0]);

        //             this.f.email.setValue(responseUser.email);
        //             this.f.numeroTelefono.setValue(responseUser.numeroTelefono);
        //         },
        //         error => { this.alertService.error(error); this.loading = false; });
        // }
    }

    get f() { return this.form.controls; }

    onSubmit() {

        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }
        this.loading = true;

        // this.companiaForm. = this.form.get('cedulajuridica').value;

        // this.companiaForm. =  this.form.get('nombre').value;

        // this.companiaForm. = this.form.get('email').value;
        // this.companiaForm. = this.form.get('numeroTelefono').value;

        if (this.addUser) {
            this.accountService.addUser(this.companiaForm)
            .pipe(first())
            .subscribe( responseAddUser => {

                if (responseAddUser.exito) {
                    this.router.navigate([this.URLRedirectPage], { relativeTo: this.route });
                    this.alertService.success(responseAddUser.responseMesagge, { keepAfterRouteChange: true });
                }else{
                    this.alertService.error(responseAddUser.responseMesagge, { keepAfterRouteChange: true });
                }
                this.loading = false;
            },
            error => { console.log(error); this.alertService.error(error); this.loading = false; });
        }

        if (this.updateUser) {
            this.accountService.updateUser(this.id, this.companiaForm)
            .pipe(first())
            .subscribe(
                response => {
                    this.router.navigate([this.URLRedirectPage], { relativeTo: this.route });
                    this.alertService.success(response.responseMesagge, { keepAfterRouteChange: true });
                    this.loading = false;
                },
                error => { console.log(error); this.alertService.error(error); this.loading = false; });
        }
    }
}
