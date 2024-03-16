import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  public setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getLocalStorage(key: string): string | undefined {
    return localStorage.getItem(key) || undefined;
  }

  public removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  public clearLocalStorage() {
    localStorage.clear();
  }

  public setSessionStorage(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  public getSessionStorage(key: string) : string | undefined {
    return sessionStorage.getItem(key) || undefined;
  }

  public removeSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearSessionStorage() {
    sessionStorage.clear();
  }

}
