import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quantity-button',
  templateUrl: './quantity-button.component.html',
  styleUrls: ['./quantity-button.component.scss']
})
export class QuantityButtonComponent {

  @Input() value: number = 1;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<number>();


  ChangeQuantity(add: boolean): void {
    if (!this.disabled) {
      if (add) {
        this.value ++;
      } else {
        if (this.value > 1) {
          this.value --
        }
      }
      this.valueChange.emit(this.value);
    }
  }
}
