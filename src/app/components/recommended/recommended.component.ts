import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss'],
  animations: [
    trigger('SlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50%)' }),
        animate('250ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0%)' }),
        animate('250ms', style({ opacity: 0, transform: 'translateY(50%)' })),
      ]),
    ])
  ]
})
export class RecommendedComponent implements OnInit {
  @Input() recommended: Product[];
  customOptions: OwlOptions = {};
  constructor(
  ) {
    this.recommended = [];
  }

  ngOnInit(): void {
    this.customOptions = {
      loop: false,
      mouseDrag: true,
      touchDrag: true,
      dots: false,
      navSpeed: 700,
    }
  }
}
