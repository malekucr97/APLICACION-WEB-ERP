import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Compania } from '../_models/modules/compania';
import { User } from '@app/_models/';
import { Business, Module } from '@app/_models/';

@Injectable({ providedIn: 'root' })
export class GeneralesService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    private moduleSubject: BehaviorSubject<Module>;
    public moduleObservable: Observable<Module>;

    private businessSubject: BehaviorSubject<Business>;
    public businessObservable: Observable<Business>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    registerCompania(compania: Compania) {
        return this.http.post(`${environment.apiUrl}/generales/registrarcompania`, compania);
    }
}