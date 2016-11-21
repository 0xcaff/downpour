import {Input, Component} from '@angular/core';

import {Directory, File} from '../models/tree';

@Component({
  selector: 'file-view',
  templateUrl:'templates/components/file-view.html',
  styleUrls: ['templates/components/file-view.css'],
})
export class FileView {
  @Input() element: File|Directory;
  @Input() open: boolean;
}

