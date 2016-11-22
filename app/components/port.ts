import {Input, Output, Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'port-view',
  templateUrl: '../../templates/components/port-view.html',
  host: {
    'style': 'display: block',
    'class': 'form-group',
  },
})
export class PortView {
  @Input() model: number[];
  @Output() modelChange: EventEmitter = new EventEmitter();

  @Input() title: string;
  @Input() disabled: boolean;
}

