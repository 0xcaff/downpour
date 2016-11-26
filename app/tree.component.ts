import { Component, Input } from '@angular/core';

import { Directory, File } from './models/tree';

@Component({
  selector: 'tree-view',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  host: {
    'style': 'display:block',
  },
})
export class TreeComponent {
  @Input() tree: Directory;
}

