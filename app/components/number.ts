import {Input, Output, Component, EventEmitter} from 'angular2/core';

@Component({
  selector: 'numberinput-view',
  templateUrl: 'templates/components/numberinput-view.html',
  host: {
    'class': 'form-group',
    'style': 'display: block',
  },
})
export class NumberInputView {
  @Input() model: string;
  @Output() modelChange: EventEmitter = new EventEmitter();

  @Input() checkbox: string;
  @Output() checkboxChange: EventEmitter = new EventEmitter();

  @Input() title: string;
  @Input() addon: boolean;
}

