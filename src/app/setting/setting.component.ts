import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingService } from '../services/setting.service';
import { IClockSetting } from '../models/clock-setting';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  setting?: IClockSetting;
  audioPlayer?: HTMLAudioElement;
  audioFiles = this._service.getAudioFiles();
  colors = this._service.getColors();

  settingForm: FormGroup = this._formBuilder.group({
    minute: [0, [Validators.required, Validators.min(1)]],
    autoStart: [false],
    sound: ['', Validators.required],
    color: ['', Validators.required],
  })

  constructor(private _formBuilder: FormBuilder,
    private _service: SettingService,
    private _audioService: AudioService
  ) { }

  ngOnInit() {
    this._service.clockSetting.subscribe(res => {
      this.setting = res;
      if (this.setting.interval) {
        this.settingForm.addControl('interval',
          this._formBuilder.control(0, [Validators.required, Validators.min(1)])
        );
      } else this.settingForm.removeControl('interval');
      this.settingForm.patchValue(this.setting);
    });
  }

  playAudio() {
    this._audioService.play(this.settingForm.value.sound);
  }

  changeTheme() {
    if(this.setting) {
      this.setting!.color = this.settingForm.value.color;
      this._service.clockSetting.next(this.setting);
    }
  }

  save() {
    if (!this.settingForm.dirty || this.settingForm.invalid) return;
    this.setting = { ...this.setting, ...this.settingForm.value };
    this._service.putClockSetting(this.setting!).subscribe(() => {
      this._service.clockSetting.next(this.setting!);
    });
    // console.log(this.setting);
  }

  ngOnDestroy() {
    this._audioService.clear();
  }
}
