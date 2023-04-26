import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit{

  loader1: boolean;
  loader2: boolean;
  loader3: boolean;
  loader4: boolean;
  loader5: boolean;

  constructor() {
    this.loader1 = false;
    this.loader2 = false;
    this.loader3 = false;
    this.loader4 = false;
    this.loader5 = false;
  }

  ngOnInit(): void {
      this.loader1 = true;
      setTimeout(() => {
        this.loader2 = true;
        setTimeout(() => {
          this.loader3 = true;
          setTimeout(() => {
            this.loader4 = true;
            setTimeout(() => {
              this.loader5 = true;
            }, 50);
          }, 50);
        }, 50);
      }, 50);
  }
}
