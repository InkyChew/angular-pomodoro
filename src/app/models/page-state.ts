import { AppComponent } from "../app.component";

export interface IPageState {
    component: AppComponent;
    color: string;
    init(): void;
    navigateUp(): void;
    navigateDown(): void;
    tab(n: number): void;
}

export abstract class PageState implements IPageState {
    abstract path: string;
    abstract color: string;
    component: AppComponent;

    constructor(context: AppComponent) {
        this.component = context;
    }

    abstract init(): void;
    abstract navigateUp(): void;
    abstract navigateDown(): void;


    tab(n: number) {
        this.navigateTab(n);
    }

    private navigateTab(direction: number) {
        const newTab = (this.component.tab + direction - 1 + 3) % 3 + 1;
        this.component.navigate([this.path, newTab]);
        this.component.tvar += direction;
    }
}

export class ClockPage extends PageState {
    color: string = '';
    path: string = '/clock';

    init() {
        this.component.setTab();
    }

    navigateUp() {
        this.component.navigate(['/info']);
        this.component.pvar--;
    }

    navigateDown() {
        this.component.navigate(['/setting', this.component.tab]);
        this.component.pvar++;
    }
}

export class SettingPage extends PageState {
    color: string = '';
    path: string = '/setting';

    init() {
        this.component.setTab();
    }

    navigateUp() {
        this.component.navigate(['/clock', this.component.tab]);
        this.component.pvar--;
    }

    navigateDown() {
        this.component.navigate(['/info']);
        this.component.pvar++;
    }
}

export class InfoPage extends PageState {
    color: string = '#2b6d8f';
    path: string = '/info';

    init() {
        if (!this.component.tab) this.component.tab = 1;
    }

    navigateUp() {
        this.component.navigate(['/setting', this.component.tab]);
        this.component.pvar--;
    }

    navigateDown() {
        this.component.navigate(['/clock', this.component.tab]);
        this.component.pvar++;
    }

    override tab(): void {

    }
}