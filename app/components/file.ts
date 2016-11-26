import { Input, Component } from '@angular/core';

import { Directory, File } from '../models/tree';

@Component({
  selector: 'file-view',
  templateUrl: './file.html',
  styleUrls: ['./file.css'],
})
export class FileComponent {
  @Input() element: File|Directory;
  @Input() open: boolean;
}

