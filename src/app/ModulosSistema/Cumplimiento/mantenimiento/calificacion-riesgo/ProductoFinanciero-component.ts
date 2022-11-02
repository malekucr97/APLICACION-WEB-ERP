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
import { ProductoFinanciero } from '@app/_models/Cumplimiento/ProductoFinanciero';

declare var $: any;

@Component({
    templateUrl: 'HTML_ProductoFinanciero.html',
    styleUrls: ['../../../../../assets/scss/cumplimiento/app.scss'],
})
export class ProductoFinancieroComponent implements OnInit {
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

    financialProductForm: FormGroup;

    listFinancialProducts: ProductoFinanciero[];

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

        this.financialProductForm = this.formBuilder.group({
            
            codigoProducto: [''],
            descripcion: [''],
            porcentaje: [''],
            estado: ['']
        });

        

        this.cumplimientoService.getFinancialProductsBusiness(this.userObservable.empresa)
            .pipe(first())
            .subscribe(financialProductsResponse => {

                if (financialProductsResponse.length > 0) {
                    this.showList = true;
                    this.listFinancialProducts = financialProductsResponse;
                }
            },
            error => {
                let message : string = 'Problemas al consultar los productos financieros. ' + error;
                this.alertService.error(message); 
            });
    }

    onAdd() : void {

        this.add = true;
        this.buttomText = 'Registrar';

        this.financialProductForm = this.formBuilder.group({
            
            codigoProducto: ['', Validators.required],
            descripcion: ['', Validators.required],
            porcentaje: ['', Validators.required],
            estado: ['A', Validators.required]
        });

        $('#productoFinancieroModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onEdit(productoFinanciero:ProductoFinanciero) : void {

        this.update = true;
        this.buttomText = 'Actualizar';

        this.financialProductForm = this.formBuilder.group({
            codigoProducto: [productoFinanciero.codigoProducto, Validators.required],
            descripcion: [productoFinanciero.descripcion, Validators.required],
            porcentaje: [productoFinanciero.porcentaje, Validators.required],
            estado: [productoFinanciero.estado, Validators.required]
        });

        $('#productoFinancieroModal').modal({backdrop: 'static', keyboard: false}, 'show');
    }

    onDelete(productoFinanciero:ProductoFinanciero) : void {

        this.delete = true;

        if(confirm("Está seguro que desea eliminar el producto financiero " + productoFinanciero.descripcion)) {
            console.log("pos si");
        } else {console.log("pos no");}
    }

    get f() { return this.financialProductForm.controls; }

    onSubmit() : void {

        this.alertService.clear();
        this.submitted = true;

        var today = new Date();

        if (this.financialProductForm.invalid)
            return;
        
        let financialProductForm = new ProductoFinanciero();

        financialProductForm.codigoCompania = this.companiaObservable.id;
        financialProductForm.codigoProducto = this.financialProductForm.get('codigoProducto').value;
        financialProductForm.descripcion = this.financialProductForm.get('descripcion').value;
        financialProductForm.porcentaje = this.financialProductForm.get('porcentaje').value;
        financialProductForm.estado = this.financialProductForm.get('estado').value;

        if (this.add) {
            financialProductForm.adicionadoPor = this.userObservable.identificacion;
            financialProductForm.fechaAdicion = today;
 
            // procedure add
        }
        
        if (this.update) {
            financialProductForm.modificadoPor = this.userObservable.identificacion;
            financialProductForm.fechaModificacion = today;

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