import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  onChangeSelect() {
    console.log("Nuevo valor seleccionado:", this.selected);
    // Aquí puedes ejecutar cualquier otra lógica que necesites
  }

}
