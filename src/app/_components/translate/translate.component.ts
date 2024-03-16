import { Component, OnInit } from '@angular/core';
import { LocalStorageService, TranslateMessagesService } from '@app/_services';


@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit {
  selected = 'es';	
  lenguageList = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' }
  ];

  constructor(
    private translate: TranslateMessagesService,
    private localStorageService: LocalStorageService
    ) { 
    this.selected = this.localStorageService.getLocalStorage('lenguage') || 'es';
    translate.setDefaultLanguage(this.selected);
  }

  ngOnInit(): void {
  }

  onChangeSelect() {
    this.translate.changeTranslateLanguage(this.selected);
    this.localStorageService.setLocalStorage('lenguage', this.selected);
  }

}
