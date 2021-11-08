// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';

// import { AccountService, AlertService } from '@app/_services';

// import { User } from '../_models';
// import { Business } from '@app/_models/business';

// @Component({ templateUrl: 'register.component.html' })
// export class RegisterComponent implements OnInit {
//     form: FormGroup;
//     loading = false;
//     submitted = false;
//     user = new User;
//     business = new Business;

//     constructor(
//         private formBuilder: FormBuilder,
//         private route: ActivatedRoute,
//         private router: Router,
//         private accountService: AccountService,
//         private alertService: AlertService
//     ) { }

//     ngOnInit() {
//         this.form = this.formBuilder.group({
//             nombre: ['', Validators.required],
//             cedulajuridica: ['', Validators.required]
//         });
//     }

//     // convenience getter for easy access to form fields
//     get f() { return this.form.controls; }

//     onSubmit() {
//         this.submitted = true;

//         // reset alerts on submit
//         this.alertService.clear();

//         // stop here if form is invalid
//         if (this.form.invalid) {
//             return;
//         }

//         this.business.id = 'EMP-ID-' + this.form.get('cedulajuridica').value;
//         this.business.nombre = this.form.get('nombre').value;
//         this.business.cedulaJuridica = this.form.get('cedulajuridica').value;

//         this.loading = true;
//         this.accountService.addBusiness(this.business)
//             .pipe(first())
//             .subscribe(
//                 data => {
//                     this.alertService.success('Empresa registrada correctamente', { keepAfterRouteChange: true });
//                     this.router.navigate(['adminBusiness'], { relativeTo: this.route });
//                 },
//                 error => {
//                     this.alertService.error(error);
//                     this.loading = false;
//                 });
//     }
// }