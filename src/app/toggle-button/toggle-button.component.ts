import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ams-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent implements OnInit {
  @Input() activeText = '';
  @Input() inActiveText = '';

  @Output() toggled = new EventEmitter<boolean>();

  isActive = false;

  buttonText = '';

  ngOnInit() {
    this.buttonText = this.inActiveText;
  }

  toggle() {
    this.isActive = !this.isActive;
    this.buttonText = this.isActive ? this.activeText : this.inActiveText;

    this.toggled.emit(this.isActive);
  }
}
