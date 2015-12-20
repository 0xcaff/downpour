import {Component, ChangeDetectionStrategy, View, Input} from 'angular2/core';

import {Directory, File} from '../models/tree';

@Component({
  selector: 'tree-view',
})
@View({
  templateUrl:'templates/components/tree-view.html',
  directives: [TreeComponent],
})
export class TreeComponent {
  @Input() tree: Directory;
}

