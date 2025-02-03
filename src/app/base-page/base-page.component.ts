import { Component, HostListener } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-base-page',
  standalone: true,
  imports: [],
  templateUrl: './base-page.component.html',
  styleUrl: './base-page.component.css'
})
export class BasePageComponent {
  direction = new Subject<Direction>();

  private _startX: number = 0;
  private _startY: number = 0;
  private _endX: number = 0;
  private _endY: number = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this._startX = event.touches[0].clientX;
    this._startY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this._endX = event.changedTouches[0].clientX;
    this._endY = event.changedTouches[0].clientY;

    // Determine swipe direction (left, right, up, down)
    const diffX = this._endX - this._startX;
    const diffY = this._endY - this._startY;

    // Threshold to prevent accidental small movements being considered as swipes
    const threshold = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe (left or right)
      if (diffX > threshold) {
        this.direction.next(Direction.Left);
      } else if (diffX < -threshold) {
        this.direction.next(Direction.Right);
      }
    } else {
      // Vertical swipe (up or down)
      if (diffY > threshold) {
        this.direction.next(Direction.Up);
      } else if (diffY < -threshold) {
        this.direction.next(Direction.Down);
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.direction.next(Direction.Up);
        break;
      case 'ArrowDown':
        this.direction.next(Direction.Down);
        break;
      case 'ArrowLeft':
        this.direction.next(Direction.Left);
        break;
      case 'ArrowRight':
        this.direction.next(Direction.Right);
        break;
    }
  }
}

export enum Direction {
  Up = 1,
  Right = 2,
  Down = 3,
  Left = 4
}