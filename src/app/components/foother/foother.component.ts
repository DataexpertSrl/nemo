import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-foother',
  templateUrl: './foother.component.html',
  styleUrls: ['./foother.component.scss']
})
export class FootherComponent {
  year: number;
  constructor(
    public trasnlsate: TranslateService,
    private router: Router,
    public sharedService: SharedService) {
    this.year = new Date().getFullYear();
  }

  GoTo(route: string): void {
    this.router.navigate([route])
  }
}
