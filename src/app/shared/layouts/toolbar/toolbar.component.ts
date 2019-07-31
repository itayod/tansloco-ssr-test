import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';

import { TranslatesService, ILang } from '@shared/translates';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  public langList$: Observable<ILang[]> = of([
    { code: 'en', name: 'English', culture: 'en-US' },
    { code: 'es', name: 'Espanol', culture: 'ru-RU' },
  ]);
  public currentLang: string;

  constructor(private _translatesService: TranslocoService) {}

  ngOnInit(): void {
    // this.langList$ = this._translatesService.getLangList();
    // this.currentLang = this._translatesService.getCurrentLang();
  }

  public changeLang(code: string): void {
    console.log(code);
    this._translatesService.setLangAndLoad(code);
  }
}
