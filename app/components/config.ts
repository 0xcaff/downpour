import {Component, Input} from 'angular2/core';
import {Configuration} from '../models/configuration';

@Component({
  selector: 'config-view',
  templateUrl:'templates/components/config-view.html',
})
export class ConfigurationComponent {
  @Input() config: Configuration;
}

