import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseMessage } from '@app/_models';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class MacredService {

    constructor( private http: HttpClient ) { }

    connection() {
        return this.http.put<ResponseMessage>(`${environment.apiUrl}/macred/`, null);
    }
}