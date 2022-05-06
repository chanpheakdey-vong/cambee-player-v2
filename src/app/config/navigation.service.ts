import { Injectable } from '@angular/core'
import { Router, ActivationEnd } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class NavigationService {
  previousComponent: any;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.previousComponent = event.snapshot.component;
      }
    })
  }
}