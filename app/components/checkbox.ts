import {Input, Output, Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'checkbox-view',
  templateUrl: 'templates/components/checkbox-view.html',
  host: {
    'class': 'checkbox',
  },
})
export class CheckboxView {
  @Input() model: boolean;
  @Output() modelChange: EventEmitter = new EventEmitter();

  @Input() title: string;
  @Input() disabled: boolean;
}

