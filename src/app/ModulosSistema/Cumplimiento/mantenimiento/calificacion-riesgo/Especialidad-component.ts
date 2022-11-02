import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService} from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { CumplimientoService } from '@app/_services/cumplimiento.service';
import { ActivatedRoute } from '@angular/router';
import { httpModulesPages } from '@environments/environment-access-admin';
import { Especialidad } from '@app/_models/Cumplimiento/Especialidad';

declare var $: any;

@Component({
    templateUrl: 'HTML_Especialidad.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class EspecialidadComponent implements OnInit {
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

    specialtyForm: FormGroup;

    listSpecialty: Especialidad[];

    public URLAddEditGroupPage: string = httpModulesPages.urlCumplimiento_Grupo;

    constructor (private formBuilder: FormBuilder,
                 private cumplimientoService: CumplimientoService, 
                 private accountService: AccountService,
                 private alertService: AlertService,
                 private route: ActivatedRoute)
    {
        this.userObservable = this.accountService.userValue;
        this.moduleObservable = this.accountService.moduleValue;
        this.companiaObservable = this.accountService.businessValue;
    }

    ngOnInit() {

        this.specialtyForm = this.formBuilder.group({
            
            descripcion: [''],
            valorRiesgo: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getSpecialtiesBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(specialtyResponse => {

                if (specialtyResponse.length > 0) {
                    this.showList = true;
                    this.listSpecialty = specialtyResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar las especialidades. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.specialtyForm = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required]
        });

        $('#especialidadModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(specialty:Especialidad) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.specialtyForm = this.formBuilder.group({
            descripcion: [specialty.descripcion, Validators.required],
            valorRiesgo: [specialty.valorRiesgo, Validators.required],
            estado: [specialty.estado, Validators.required]
        });

        $('#especialidadModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(specialty:Especialidad) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar la especialidad " + specialty.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.specialtyForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.specialtyForm.invalid)
            return;
        
        let specialtyForm = new Especialidad();

        specialtyForm.codigoCompania = this.companiaObservable.id;
        specialtyForm.descripcion = this.specialtyForm.get('descripcion').value;
        specialtyForm.valorRiesgo = this.specialtyForm.get('valorRiesgo').value;
        specialtyForm.estado = this.specialtyForm.get('estado').value;

        if (this.add) {
            specialtyForm.adicionadoPor = this.userObservable.identificacion;
            specialtyForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            specialtyForm.modificadoPor = this.userObservable.identificacion;
            specialtyForm.fechaModificacion = today;

            // this.cumplimientoService.update(riskForm)
            //     .pipe(first())
            //     .subscribe( responseUpdate => {

            //         if (responseUpdate.exito) {
            //             this.alertService.success(responseUpdate.responseMesagge);
            //         } else {
            //             this.alertService.error(responseUpdate.responseMesagge);
            //         }
            //         $('#nivelRiesgoModal').modal('hide');
            //     },
            //     error => {
            //         let messaje : string = 'Problemas al actualizar la información del nivel de riesgo. ' + error;
            //         this.alertService.error(messaje);
            //     });
        }

        
    }
}