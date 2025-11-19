import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.toggleMenu();
      });
  }

  async ngOnInit() {
    this.toggleMenu();
  }


  toggleMenu() {
    const hideMenuRoutes = ['/login', '/forgot', '/reset'];

    const currentUrl = this.router.url.split('?')[0];
    const isHiddenPage = hideMenuRoutes.some(route => currentUrl.startsWith(route));

    this.menuCtrl.enable(!isHiddenPage);
  }
  // toggleMenu() {
  //   const hideMenuRoutes = ['/login', '/forgot', '/reset'];
  //   const isHiddenPage = hideMenuRoutes.includes(this.router.url);

  //   this.menuCtrl.enable(!isHiddenPage);
  // }
}
