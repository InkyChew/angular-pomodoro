import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private _audioPlayer?: HTMLAudioElement;

  constructor() { }

  play(src: string) {
    this.clear();
    this._audioPlayer = new Audio(src);
    this._audioPlayer.play();
  }

  clear() {
    this._audioPlayer?.pause();
    this._audioPlayer = undefined;
  }
}
