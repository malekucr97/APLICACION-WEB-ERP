import { Component, OnInit } from '@angular/core';
import { TranslateMessagesService } from '@app/_services/translate-messages.service';

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

  constructor(private translate: TranslateMessagesService) { 
    translate.setDefaultLanguage('es');
  }

  ngOnInit(): void {
  }

  onChangeSelect() {
    this.translate.changeTranslateLanguage(this.selected);
  }

}
