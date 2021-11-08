// import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';

// import { AccountService, AlertService } from '@app/_services';

// import { User } from '../_models/user';
// import { Business } from '../_models/business';
// import { BusinessUser } from '../_models/businessUser';

// @Component({ templateUrl: 'addbusiness.component.html' })
// export class AddBusinessComponent implements OnInit {
//     form: FormGroup;
    
//     loading = false;

//     idUser: string;
//     nameUser: string;
//     idBusiness: string;

//     esAdmin: boolean;

//     user = new User;
//     businessUser = new BusinessUser;

//     public listBusiness: Business[] = [];

//     public listSelection: any = [
//         { id: 1, name: 'Es Administrador ?' }
//     ];

//     constructor(
//         private formBuilder: FormBuilder,
//         private route: ActivatedRoute,
//         private router: Router,
//         private accountService: AccountService,
//         private alertService: AlertService
//     ) { }

//     ngOnInit() {
//         this.idUser = this.route.snapshot.params['id'];
//         this.nameUser = this.route.snapshot.params['nombre'];

//         this.form = this.formBuilder.group({
//             txtNombreUsuario: ['']

//         });

//         this.f.txtNombreUsuario.setValue(this.idUser + ' - ' + this.nameUser);

//         this.accountService.getAllBusiness()
//             .pipe(first())
//             .subscribe(result => {
//                 this.listBusiness = result;
//             });
//     }

//     onSelect(idBusiness: any) {

//         if (idBusiness != "0")
//             this.idBusiness = idBusiness;
//     }

//     get f() { return this.form.controls; }


//     onCheckboxChange(e) {
//         if ( e.target.checked ) {
//             this.esAdmin = true;
//         }else{
//             this.esAdmin = false;
//         }
//     }

//     onSubmit() {

//         this.alertService.clear();

//         this.loading = true;

//         this.businessUser.idUsuario = this.idUser;
//         this.businessUser.idEmpresa = this.idBusiness;
        
//         if(this.esAdmin == true){
//             this.businessUser.idRol = 'admin-e';
//         }else{
//             this.businessUser.idRol = 'Sin definir';
//         }

//         this.accountService.asignarUsuarioEmpresa(this.businessUser)
//             .pipe(first())
//             .subscribe(
//                 data => {
//                     this.alertService.success(data.toString(), { keepAfterRouteChange: true });
//                     this.router.navigate(['users']);
//                 },
//                 error => {
//                     this.alertService.error(error);
//                     this.loading = false;
//                     this.router.navigate(['users']);
//                 });
//     }
// }