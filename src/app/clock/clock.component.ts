import { Component, HostListener } from '@angular/core';
import { TimePipe } from '../pipes/time.pipe';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Stage } from '../models/stage';
import { ClockService } from '../services/clock.service';
import { SettingService } from '../services/setting.service';
import { IClockState } from '../models/clock-state';
import { AudioService } from '../services/audio.service';
import { ClockPage, IPageState } from '../models/page-state';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TimePipe],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent {
  clockState?: IClockState;
  focusTimes: number = this._service.getFocusTimes();
  private _pageState?: IPageState;
  
  constructor(public router: Router,
    private _service: ClockService,
    private _settingService: SettingService,
    public audioService: AudioService,
    private _appComponent: AppComponent
  ) { }

  private get pageState(): IPageState {
    return this._pageState ? this._pageState : new ClockPage(this._appComponent);
  }

  ngOnInit() {
    this.clockState?.stop();
    this._settingService.clockSetting.subscribe(res => {
      this.clockState = this._service.createClockState(this, res);
      this.clockState?.init();
    });
  }

  updateFocusTimes() {
    this._service.setFocusTimes(this.focusTimes++);
  }

  nextStage(stage: Stage) {
    const n = stage - this.clockState!.clock.id;
    this.pageState.tab(n);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.clockState) return;
    const isStart = this.clockState.isStart;
    switch (event.code) {
      case 'Space':
        isStart ? this.clockState.stop() : this.clockState.start();
        break;
      case 'End':
        if (isStart) this.clockState.nextStage();
        break;
    }
  }
}
