import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService, GeneralesService } from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { Grupo } from '@app/_models/Cumplimiento/Grupo';
import { CumplimientoService } from '@app/_services/cumplimiento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { httpModulesPages } from '@environments/environment-access-admin';

declare var $: any;

@Component({
    templateUrl: 'HTML_Grupo.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class GrupoComponent implements OnInit {
    @ViewChild(MatSidenav) sidenav !: MatSidenav;
    
    userObservable: User;
    moduleObservable: Module;
    companiaObservable: Compania;

    showList : boolean = false;
    submitted : boolean = false;
    update: boolean = false;
    add: boolean = false;
    delete: boolean = false;

    buttomText : string = '';

    groupFrom: FormGroup;

    listGroups: Grupo[];
    listGroupsSubject : Grupo[];

    public URLAddEditGroupPage: string = httpModulesPages.urlCumplimiento_Grupo;

    constructor (private formBuilder: FormBuilder,
                 private cumplimientoService: CumplimientoService, 
                 private accountService: AccountService,
                 private alertService: AlertService,
                 private route: ActivatedRoute,
                 private router: Router) 
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;
        // this.listGroupsSubject = this.cumplimientoService.groupsListValue;
    }

    ngOnInit() {

        if (!this.cumplimientoService.groupsListValue) {
            // this.router.navigate([this.HTTPListBusinessPage]);
            return;
        }

        let idGrupo : string;
        let urlPath : string = this.route.snapshot.routeConfig.path;

        if (urlPath.includes('update')) {
            
            this.update = true;
            idGrupo = this.route.snapshot.params.pidGrupo;
            this.buttomText = 'Actualizar';

            this.groupFrom = this.formBuilder.group({
                id: [''],
                codigoCompania: [''],
                descripcionGrupo: ['', Validators.required],
                estado: ['', Validators.required]
            });

        } else if (urlPath.includes('add')) {
            this.add = true;
            this.buttomText = 'Registrar';

            this.groupFrom = this.formBuilder.group({
                id: [''],
                codigoCompania: [''],
                descripcionGrupo: ['', Validators.required],
                estado: ['A', Validators.required]
            });

        } else if (urlPath.includes('delete')) {
            this.delete = true;

        } else {

            this.groupFrom = this.formBuilder.group({
                descripcionGrupo: [''],
                estado: ['']
            });

            this.cumplimientoService.getGroupsBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(groupsResponse => {

                if (groupsResponse.length > 0) {
                    this.showList = true;
                    this.listGroups = groupsResponse;   
                    this.cumplimientoService.suscribeListGroups(this.listGroups);
                }
            },
            error => {
                let message : string = 'Problemas al consultar los grupos de riesgo. ' + error;
                this.alertService.error(message); 
            });
        }
    }

    get f() { return this.groupFrom.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.groupFrom.invalid)
            return;
        
        let groupForm = new Grupo();

        groupForm.codigoCompania = this.companiaObservable.id;
        groupForm.descripcionGrupo = this.groupFrom.get('descripcionGrupo').value;
        groupForm.estado = this.groupFrom.get('estado').value;

        if (this.add) {
            groupForm.adicionadoPor = this.userObservable.identificacion;
            groupForm.fechaAdicion = today;
 
        }
        if (this.update) {
            groupForm.modificadoPor = this.userObservable.identificacion;
            groupForm.fechaModificacion = today;

            this.cumplimientoService.update(groupForm)
                .pipe(first())
                .subscribe( responseUpdate => {

                    if (responseUpdate.exito) {
                        this.alertService.success(responseUpdate.responseMesagge);
                    } else {
                        this.alertService.error(responseUpdate.responseMesagge);
                    }
                    $('#updateModal').modal('hide');
                },
                error => {
                    let messaje : string = 'Problemas al actualizar la información del grupo. ' + error;
                    this.alertService.error(messaje);
                });
        }

        
    }
}