import {Component, ChangeDetectionStrategy, View, Input} from 'angular2/core';

import {Directory, File} from '../models/tree';
import {BytesPipe} from '../pipes/bytes';

@Component({
  selector: 'tree-view',
  templateUrl:'templates/components/tree-view.html',
  styleUrls: ['templates/components/tree-view.css'],
  directives: [TreeComponent],
  pipes: [BytesPipe],
})
export class TreeComponent {
  @Input() tree: Directory;
}

