import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent {

  @Input() label?: string | null;
  @Input() control?: AbstractControl | null;
  @Input() controlName?: string | null;
  @Input() formGroup?: FormGroup | null;
  show: boolean
  isFocused: boolean;

  constructor() {
    this.show = false;
    this.isFocused = false;
  }

  ShowPassword(): void {
    this.show = !this.show
  }

  IsFocused(val: boolean) {
    this.isFocused = val;
  }
}
