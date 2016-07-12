import {Input, Component} from '@angular/core';

import {Directory, File} from '../models/tree';
import {BytesPipe} from '../pipes/bytes';

@Component({
  selector: 'file-view',
  templateUrl:'templates/components/file-view.html',
  styleUrls: ['templates/components/file-view.css'],
  pipes: [BytesPipe],
})
export class FileView {
  @Input() element: File|Directory;
  @Input() open: boolean;
}

