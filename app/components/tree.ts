import {Component, Input} from '@angular/core';

import {Directory, File} from '../models/tree';
import {FileView} from './file';

@Component({
  selector: 'tree-view',
  templateUrl:'templates/components/tree-view.html',
  styleUrls: ['templates/components/tree-view.css'],
  directives: [TreeComponent, FileView],
  host: {
    'style': 'display:block',
  },
})
export class TreeComponent {
  @Input() tree: Directory;
}

