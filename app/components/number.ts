import {Input, Output, Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'numberinput-view',
  templateUrl: '../../templates/components/numberinput-view.html',
  host: {
    'class': 'form-group',
    'style': 'display: block',
  },
})
export class NumberInputView {
  @Input() model: string;
  @Output() modelChange: EventEmitter<number> = new EventEmitter();

  @Input() checkbox: string;
  @Output() checkboxChange: EventEmitter<boolean> = new EventEmitter();

  @Input() title: string;
  @Input() addon: boolean;
  @Input() placeholder: string;
}

