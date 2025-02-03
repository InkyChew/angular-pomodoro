import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';
import { switchMap, of, throwError, Subject } from 'rxjs';
import { IClockSetting, LongBreakSetting, PomodoroSetting, ShortBreakSetting } from '../models/clock-setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  clockSetting: Subject<IClockSetting> = new Subject();

  constructor(private _dbService: IndexedDbService) { }

  getClockSetting(id: number) {
    return this._dbService.read(id).pipe(
      switchMap((res) => {
        if (res) {
          return of(res);
        } else {
          return this.postClockSetting(id);
        }
      }),
    );
  }

  postClockSetting(id: number) {
    const clocks = [, new PomodoroSetting(), new ShortBreakSetting(), new LongBreakSetting()];
    const clock = clocks[id];
    if (clock) {
      return this._dbService.put(clock);
    } else {
      return throwError(() => 'Invalid clock ID');
    }
  }

  putClockSetting(clock: IClockSetting) {
    return this._dbService.put(clock);
  }

  getAudioFiles() {
    return [
      { name: 'bell', path: 'assets/bell.mp3' },
      { name: 'ding', path: 'assets/ding.mp3' },
      { name: 'bell-ding', path: 'assets/bell-ding.mp3' },
      { name: 'lofi', path: 'assets/lofi.mp3' },
      { name: 'guitar', path: 'assets/guitar.mp3' },
      { name: 'melody', path: 'assets/melody.mp3' },
    ];
  }

  getColors() {
    return [
      '#E63946',
      '#2A9D8F',
      '#264653'
    ];
  }
}
