import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { BasePageComponent, Direction } from './base-page/base-page.component';
import { IPageState, ClockPage, SettingPage, InfoPage } from './models/page-state';
import { SettingService } from './services/setting.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent extends BasePageComponent {
  snapshot?: ActivatedRouteSnapshot;
  pvar: number = 1;
  tvar: number = 1;
  tab: number = 1;
  pageState?: IPageState;

  constructor(public _router: Router,
    public _route: ActivatedRoute,
    private _settingService: SettingService) {
    super();
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.snapshot = this._route.firstChild?.snapshot;
      this.setPage();
    });
    this.handlePageDirection();
  }

  setPage() {
    const page = +this.snapshot?.data['page'];
    switch (page) {
      case 1:
        this.pageState = new ClockPage(this);
        break;
      case 2:
        this.pageState = new SettingPage(this);
        break;
      case 3:
        this.pageState = new InfoPage(this);
        break;
    }
    this.pageState?.init();
  }

  setTab() {
    this._settingService.clockSetting.subscribe(res => {
      this.pageState!.color = res.color;
    });
    this.tab = +this.snapshot?.params['stage'];
    this._settingService.getClockSetting(this.tab).subscribe(res => {
      this._settingService.clockSetting.next(res);
    });
  }

  navigate(commands: any[]) {
    this._router.navigate(commands);
  }

  handlePageDirection() {
    this.direction.subscribe(d => {
      switch (d) {
        case Direction.Up:
          this.pageState?.navigateUp();
          break;
        case Direction.Down:
          this.pageState?.navigateDown();
          break;
        case Direction.Left:
          this.pageState?.tab(-1);
          break;
        case Direction.Right:
          this.pageState?.tab(1);
          break;
      }
    });
  }
}
