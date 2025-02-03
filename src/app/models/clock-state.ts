import { Stage } from "./stage";
import { ClockComponent } from "../clock/clock.component";
import { IClockSetting } from "./clock-setting";

export interface IClockState {
    component: ClockComponent;
    clock: IClockSetting;
    round: number;
    milliseconds: number;
    isStart: boolean;
    init(): void;
    nextStage(): void;
    start(): void;
    stop(): void;
    progress(): string;
}

export abstract class ClockState implements IClockState {
    abstract round: number;
    component: ClockComponent;
    clock: IClockSetting;
    milliseconds: number;
    isStart: boolean = false;
    worker?: Worker;

    constructor(component: ClockComponent,
        clock: IClockSetting) {
        this.component = component;
        this.clock = clock;
        this.milliseconds = clock.minute * 60000;
    }

    abstract init(): void;
    abstract nextStage(): void;

    start() {
        this.stop();
        this.component.audioService.clear();
        this.worker = new Worker(new URL('../services/timer.worker', import.meta.url));
        this.worker.postMessage(this.milliseconds);
        this.worker.onmessage = ({ data }) => {
            this.isStart = true;            
            this.milliseconds = data;
            if (this.milliseconds <= 1000) {
                this.component.audioService.play(this.clock.sound);
                this.stop();
                this.nextStage();
            }
        };
    }

    stop() {
        this.isStart = false;
        this.worker?.terminate();
    }

    progress(): string {
        const x = 360 - (360 * this.milliseconds / (this.clock.minute * 60000));
        return `conic-gradient(var(--theme) ${x}deg, var(--theme-dark-color) ${x}deg)`;
    }
}

export class FocusState extends ClockState {
    round: number = this.component.focusTimes;

    init() {
        this.component.focusTimes > 1 && this.clock.autoStart
            ? this.start() : this.stop();
    }

    nextStage() {
        this.component.updateFocusTimes();
        const stage = this.component.focusTimes % this.clock.interval! > 0
            ? Stage.ShortBreak
            : Stage.LongBreak;
        this.component.nextStage(stage);
    }
}

export class BreakState extends ClockState {
    round: number = this.component.focusTimes - 1;

    init() {
        this.clock.autoStart ? this.start() : this.stop();
    }

    nextStage() {
        this.component.nextStage(Stage.Pomodoro);
    }
}