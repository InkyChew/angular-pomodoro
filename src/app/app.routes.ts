import { Routes } from '@angular/router';
import { ClockComponent } from './clock/clock.component';
import { InfoComponent } from './info/info.component';
import { SettingComponent } from './setting/setting.component';

export const routes: Routes = [
    { path: '', redirectTo: 'clock/1', pathMatch: 'full' },
    { path: 'clock/:stage', component: ClockComponent, pathMatch: 'full', data: { page: 1 } },
    { path: 'setting/:stage', component: SettingComponent, pathMatch: 'full', data: { page: 2 } },
    { path: 'info', component: InfoComponent, pathMatch: 'full', data: { page: 3 } }
];
