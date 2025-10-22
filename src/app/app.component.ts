import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService, AlertService } from './_services';
import { Location } from '@angular/common';
import { Alert, User } from './_models';
import { Subscription } from 'rxjs';

@Component({selector: 'app',
            templateUrl: 'app.component.html',
            styleUrls: ['../assets/scss/app.scss'],
            standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  
  user: User;
  alert: Alert | null = null;
  private subscription!: Subscription;

  constructor (
    private accountService: AccountService, 
    private location: Location,
    private alertService: AlertService
  ) { 
      this.accountService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {

    // 🔹 Suscripción a las alertas globales
    this.subscription = this.alertService.onAlert().subscribe((alert) => {
      if (!alert.message) {
        this.alert = null; // limpiar
        return;
      }

      this.alert = alert;

      // 🔹 Autodesaparece tras unos segundos
      setTimeout(() => (this.alert = null), 4000);
    });

    window.addEventListener('popstate', () => { 
      window.history.replaceState(null, '', '/');
      this.location.forward();
    });
  }

  ngOnDestroy(): void { if (this.subscription) this.subscription.unsubscribe(); }
}
