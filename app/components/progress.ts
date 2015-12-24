import {Input, Component} from 'angular2/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'templates/components/progress-bar.html',
  styleUrls: ['templates/components/progress-bar.css'],
})
export class ProgressComponent {
  @Input() percentage: number;
  @Input() active: boolean;
  @Input() color: string;
  @Input() reverse: boolean;
}

