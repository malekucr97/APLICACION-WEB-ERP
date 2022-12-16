import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, AlertService} from '@app/_services';
import { User, Module } from '@app/_models';
import { first } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Compania } from '../../../../_models/modules/compania';
import { Profesion } from '@app/_models/Cumplimiento/Profesion';
import { CumplimientoService } from '@app/_services/cumplimiento.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'HTML_Profesion.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class ProfesionComponent implements OnInit {
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

    profesionForm: FormGroup;

    listProfesion: Profesion[];

    // public URLAddEditGroupPage: string = httpModulesPages.urlCumplimiento_Grupo;

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

        this.profesionForm = this.formBuilder.group({
            
            descripcion: [''],
            valorRiesgo: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getProfesionBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(profesionResponse => {

                if (profesionResponse.length > 0) {
                    this.showList = true;
                    this.listProfesion = profesionResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar las profesiones. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.profesionForm = this.formBuilder.group({
            
            descripcion: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required]
        });

        $('#profesionModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(profesion:Profesion) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.profesionForm = this.formBuilder.group({
            descripcion: [profesion.descripcion, Validators.required],
            valorRiesgo: [profesion.valorRiesgo, Validators.required],
            estado: [profesion.estado, Validators.required]
        });

        $('#profesionModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(profesion:Profesion) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar la profesión " + profesion.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.profesionForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.profesionForm.invalid)
            return;
        
        let profesionForm = new Profesion();

        profesionForm.codigoCompania = this.companiaObservable.id;
        profesionForm.descripcion = this.profesionForm.get('descripcion').value;
        profesionForm.valorRiesgo = this.profesionForm.get('valorRiesgo').value;
        profesionForm.estado = this.profesionForm.get('estado').value;

        if (this.add) {
            profesionForm.adicionadoPor = this.userObservable.identificacion;
            profesionForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            profesionForm.modificadoPor = this.userObservable.identificacion;
            profesionForm.fechaModificacion = today;

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