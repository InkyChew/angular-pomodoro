export interface IClockSetting {
    id: number;
    minute: number;
    autoStart: boolean;
    interval?: number;
    color: string;
    sound: string;
}

export abstract class ClockSetting implements IClockSetting {
    abstract id: number;
    abstract color: string;
    abstract minute: number;
    autoStart: boolean = false;
    sound: string = "assets/bell.mp3";
}

export class PomodoroSetting extends ClockSetting {
    id = 1;
    minute: number = 25;
    interval: number = 4;
    color: string = "#E63946";
}

export class ShortBreakSetting extends ClockSetting {
    id = 2;
    minute = 5
    color = "#2A9D8F";
}

export class LongBreakSetting extends ClockSetting {
    id = 3;
    minute = 15;
    color = "#264653";
}