import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  selectedTab = 'home'; // Set the default selected tab

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedTab = event.urlAfterRedirects.split('/')[1]; // Get the current tab from the URL
      }
    });
  }
}
