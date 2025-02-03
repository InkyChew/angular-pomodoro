import { Injectable } from '@angular/core';
import { ClockComponent } from '../clock/clock.component';
import { BreakState, FocusState } from '../models/clock-state';
import { Stage } from '../models/stage';
import { IClockSetting } from '../models/clock-setting';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  createClockState(context: ClockComponent, clock: IClockSetting) {
    switch (clock.id) {
      case Stage.Pomodoro:
        return new FocusState(context, clock);
      case Stage.ShortBreak:
      case Stage.LongBreak:
        return new BreakState(context, clock);
    }
    throw new Error('Invalid clock ID');
  }

  setFocusTimes(times: number) {
    localStorage.setItem("focusTimes", times.toString());
  }

  getFocusTimes(): number {
    return +(localStorage.getItem("focusTimes") ?? 1);
  }
}
