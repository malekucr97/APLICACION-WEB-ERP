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
import { Pais } from '@app/_models/Cumplimiento/Pais';

declare var $: any;

@Component({
    templateUrl: 'HTML_Pais.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class PaisComponent implements OnInit {
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

    countryForm: FormGroup;

    listCountries: Pais[];

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

        this.countryForm = this.formBuilder.group({
            
            codigoPais: [''],
            descripcion: [''],
            valorRiesgo: [''],
            estado: [''],
            indCRS: ['']
        });

        

        this.cumplimientoService.getCountriesBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(countriesResponse => {

                if (countriesResponse.length > 0) {
                    this.showList = true;
                    this.listCountries = countriesResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar los paises. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.countryForm = this.formBuilder.group({
            
            codigoPais: ['', Validators.required],
            descripcion: ['', Validators.required],
            valorRiesgo: ['', Validators.required],
            estado: ['A', Validators.required],
            indCRS: ['N', Validators.required]
        });

        $('#paisModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(pais:Pais) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.countryForm = this.formBuilder.group({
            codigoPais: [pais.codigoPais, Validators.required],
            descripcion: [pais.descripcion, Validators.required],
            valorRiesgo: [pais.valorRiesgo, Validators.required],
            estado: [pais.estado, Validators.required],
            indCRS: [pais.indCRS, Validators.required]
        });

        $('#paisModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(pais:Pais) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el país " + pais.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.countryForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.countryForm.invalid)
            return;
        
        let countryForm = new Pais();

        countryForm.codigoCompania = this.companiaObservable.id;
        countryForm.codigoPais = this.countryForm.get('codigoPais').value;
        countryForm.descripcion = this.countryForm.get('descripcion').value;
        countryForm.valorRiesgo = this.countryForm.get('valorRiesgo').value;
        countryForm.estado = this.countryForm.get('estado').value;
        countryForm.indCRS = this.countryForm.get('indCRS').value;

        if (this.add) {
            countryForm.adicionadoPor = this.userObservable.identificacion;
            countryForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            countryForm.modificadoPor = this.userObservable.identificacion;
            countryForm.fechaModificacion = today;

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