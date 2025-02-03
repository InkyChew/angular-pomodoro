import { animate, animation, style, transition, trigger } from "@angular/animations";

const up = animation([
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('.3s ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
]);

const down = animation([
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('.3s ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
]);

const next = animation([
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('.3s ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
]);

const prev = animation([
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('.3s ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
]);

export const pageTransition = trigger('pageTransition', [
    transition(':increment', up),
    transition(':decrement', down),
]);

export const tabTransition = trigger('tabTransition', [
    transition(':increment', next),
    transition(':decrement', prev),
]);

