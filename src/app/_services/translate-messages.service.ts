import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateMessagesService {

  constructor(private translate: TranslateService) { }

  translateKey(key: string): string {
    return this.translate.instant(key);
  }

  translateKeyP(key: string, parameters: object): string {
    return this.translate.instant(key,parameters);
  }

  setDefaultLanguage(language: string) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang(language);
  }

  changeTranslateLanguage(language: string) {
    this.translate.use(language);
  }
}

